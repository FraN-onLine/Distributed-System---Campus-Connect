import os
from pathlib import Path
from uuid import uuid4
from datetime import datetime

import pymysql
from pymysql.cursors import DictCursor
from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / 'uploads'
UPLOAD_DIR.mkdir(exist_ok=True)

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=[
    'http://localhost:5173',
    'http://localhost',
    'http://127.0.0.1:5173',
    'http://127.0.0.1',
])

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'db': 'ccisconnectusers',
    'autocommit': True,
    'charset': 'utf8mb4',
}


def create_db_connection():
    return pymysql.connect(cursorclass=DictCursor, **DB_CONFIG)


def fetch_all(query, params=None):
    with create_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, params or ())
            return cur.fetchall()


def execute(query, params=None):
    with create_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, params or ())
            conn.commit()


@app.route('/')
def root():
    return jsonify({'message': 'Hello from Python upload server'})


@app.route('/list-uploads', methods=['GET'])
def list_uploads():
    uploads = fetch_all(
        '''
        SELECT f.id, f.filename, f.originalname, f.title, f.uploaded_at, u.username
        FROM uploaded_files f
        LEFT JOIN users u ON f.user_id = u.id
        ORDER BY f.uploaded_at DESC
        '''
    )
    return jsonify(uploads)


@app.route('/uploads', methods=['POST'])
def upload_files():
    title = request.form.get('title', '').strip()
    user_id = request.form.get('user_id', '').strip()
    files = request.files.getlist('files')

    if not files:
        return jsonify({'error': 'No files uploaded'}), 400

    if not title:
        return jsonify({'error': 'Missing title'}), 400

    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid user_id'}), 400

    for upload_file in files:
        original_name = upload_file.filename
        suffix = Path(original_name).suffix
        generated_name = f"{int(datetime.utcnow().timestamp() * 1000)}-{uuid4().hex}{suffix}"
        file_path = UPLOAD_DIR / generated_name

        upload_file.save(file_path)

        execute(
            'INSERT INTO uploaded_files (filename, originalname, title, user_id) VALUES (%s, %s, %s, %s)',
            (generated_name, original_name, title, user_id)
        )

    return jsonify({'message': 'Files uploaded successfully'})


@app.route('/uploads/<int:file_id>', methods=['DELETE'])
def delete_upload(file_id):
    rows = fetch_all('SELECT filename FROM uploaded_files WHERE id = %s', (file_id,))
    if not rows:
        return jsonify({'error': 'File not found'}), 404

    filename = rows[0]['filename']
    file_path = UPLOAD_DIR / filename
    if file_path.exists():
        file_path.unlink()

    execute('DELETE FROM uploaded_files WHERE id = %s', (file_id,))
    return jsonify({'message': 'File deleted'})


@app.route('/uploads/<path:filename>', methods=['GET'])
def serve_upload(filename):
    target_path = UPLOAD_DIR / filename
    if not target_path.exists() or not target_path.is_file():
        abort(404)
    return send_from_directory(str(UPLOAD_DIR), filename, as_attachment=True)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3090)
