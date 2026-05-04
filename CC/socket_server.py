import os
from datetime import datetime

import pymysql
import socketio
from pymysql.cursors import DictCursor
from starlette.concurrency import run_in_threadpool

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'db': 'ccisconnectusers',
    'autocommit': True,
    'charset': 'utf8mb4',
}

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=[
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost',
        'http://127.0.0.1',
    ],
)
app = socketio.ASGIApp(sio)


def create_db_connection():
    return pymysql.connect(cursorclass=DictCursor, **DB_CONFIG)


def fetch_all_sync(query, params=None):
    with create_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, params or ())
            return cur.fetchall()


async def fetch_all(query, params=None):
    return await run_in_threadpool(fetch_all_sync, query, params)


def execute_sync(query, params=None):
    with create_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, params or ())
            conn.commit()


async def execute(query, params=None):
    await run_in_threadpool(execute_sync, query, params)


def serialize_messages(rows):
    messages = []
    for row in rows:
        msg = dict(row)
        timestamp = msg.get('timestamp')
        if isinstance(timestamp, datetime):
            msg['timestamp'] = timestamp.isoformat()
        messages.append(msg)
    return messages


@sio.event
async def connect(sid, environ, auth=None):
    print('A user connected:', sid)
    current_room = 'Dev Circle'
    await sio.save_session(sid, {'room': current_room})
    await sio.enter_room(sid, current_room)

    await execute('INSERT IGNORE INTO rooms (name) VALUES (%s)', (current_room,))

    rows = await fetch_all(
        'SELECT * FROM messages WHERE room = %s ORDER BY timestamp ASC',
        (current_room,)
    )
    await sio.emit('load_messages', serialize_messages(rows), to=sid)

    all_rooms = await fetch_all('SELECT name FROM rooms')
    await sio.emit('room_list', [r['name'] for r in all_rooms], to=sid)


@sio.event
async def join_room(sid, room='Dev Circle'):
    session = await sio.get_session(sid)
    current_room = session.get('room', 'Dev Circle')
    if current_room:
        await sio.leave_room(sid, current_room)

    await sio.enter_room(sid, room)
    session['room'] = room
    await sio.save_session(sid, session)

    await execute('INSERT IGNORE INTO rooms (name) VALUES (%s)', (room,))

    room_rows = await fetch_all(
        'SELECT * FROM messages WHERE room = %s ORDER BY timestamp ASC',
        (room,)
    )
    await sio.emit('load_messages', serialize_messages(room_rows), to=sid)

    updated_rooms = await fetch_all('SELECT name FROM rooms')
    await sio.emit('room_list', [r['name'] for r in updated_rooms])


@sio.event
async def send_message(sid, data):
    username = data.get('username', 'Anonymous')
    content = data.get('content', '')
    timestamp = data.get('timestamp', datetime.utcnow().isoformat())
    room = data.get('room', 'Dev Circle')
    user_id = data.get('userId')

    try:
        parsed = datetime.fromisoformat(timestamp)
        mysql_timestamp = parsed.strftime('%Y-%m-%d %H:%M:%S')
    except ValueError:
        mysql_timestamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')

    await execute(
        'INSERT INTO messages (username, content, timestamp, room, user_id) VALUES (%s, %s, %s, %s, %s)',
        (username, content, mysql_timestamp, room, user_id)
    )

    await sio.emit('receive_message', data, room=room)


@sio.event
async def get_rooms(sid):
    rooms = await fetch_all('SELECT name FROM rooms')
    await sio.emit('room_list', [r['name'] for r in rooms], to=sid)


@sio.event
async def change_username(sid, payload):
    user_id = payload.get('userId')
    new_username = payload.get('newUsername')
    if not user_id or not new_username:
        await sio.emit('username_changed', {'success': False, 'error': 'Missing userId or newUsername'}, to=sid)
        return

    try:
        await execute(
            'UPDATE users SET username = %s WHERE id = %s',
            (new_username, user_id)
        )
        await sio.emit('username_changed', {'success': True, 'newUsername': new_username}, to=sid)
    except Exception as exc:
        await sio.emit('username_changed', {'success': False, 'error': str(exc)}, to=sid)


@sio.event
async def disconnect(sid):
    print('A user disconnected:', sid)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=3000)
