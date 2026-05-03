import os
from pathlib import Path
from uuid import uuid4
from datetime import datetime

import aiofiles
import aiomysql
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / 'uploads'
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://localhost:5173',
        'http://localhost',
        'http://127.0.0.1:5173',
    ],
    allow_methods=['*'],
    allow_headers=['*'],
)

_db_pool = None
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'db': 'ccisconnectusers',
    'autocommit': True,
}


async def get_db_pool():
    global _db_pool
    if _db_pool is None:
        _db_pool = await aiomysql.create_pool(**DB_CONFIG)
    return _db_pool


async def fetch_all(query, params=None):
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cur:
            await cur.execute(query, params or ())
            return await cur.fetchall()


async def execute(query, params=None):
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor() as cur:
            await cur.execute(query, params or ())


app.mount('/uploads', StaticFiles(directory=str(UPLOAD_DIR)), name='uploads')


@app.get('/')
async def root():
    return {'message': 'Hello from Python upload server'}


@app.get('/list-uploads')
async def list_uploads():
    uploads = await fetch_all(
        '''
        SELECT f.id, f.filename, f.originalname, f.title, f.uploaded_at, u.username
        FROM uploaded_files f
        LEFT JOIN users u ON f.user_id = u.id
        ORDER BY f.uploaded_at DESC
        '''
    )
    return uploads


@app.post('/uploads')
async def upload_files(
    title: str = Form(...),
    user_id: int = Form(...),
    files: list[UploadFile] = File(...)
):
    if not files:
        raise HTTPException(status_code=400, detail='No files uploaded')

    if not title:
        raise HTTPException(status_code=400, detail='Missing title')

    for upload_file in files:
        original_name = upload_file.filename
        suffix = Path(original_name).suffix
        generated_name = f"{int(datetime.utcnow().timestamp() * 1000)}-{uuid4().hex}{suffix}"
        file_path = UPLOAD_DIR / generated_name

        content = await upload_file.read()
        async with aiofiles.open(file_path, 'wb') as out_file:
            await out_file.write(content)

        await execute(
            'INSERT INTO uploaded_files (filename, originalname, title, user_id) VALUES (%s, %s, %s, %s)',
            (generated_name, original_name, title, user_id)
        )

    return JSONResponse({'message': 'Files uploaded successfully'})


@app.delete('/uploads/{file_id}')
async def delete_upload(file_id: int):
    rows = await fetch_all('SELECT filename FROM uploaded_files WHERE id = %s', (file_id,))
    if not rows:
        raise HTTPException(status_code=404, detail='File not found')

    filename = rows[0]['filename']
    file_path = UPLOAD_DIR / filename
    if file_path.exists():
        file_path.unlink()

    await execute('DELETE FROM uploaded_files WHERE id = %s', (file_id,))
    return JSONResponse({'message': 'File deleted'})


if __name__ == '__main__':
    import uvicorn

    uvicorn.run('upload_server:app', host='0.0.0.0', port=3090)
