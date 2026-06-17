import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """RSVP: сохранение и получение ответов гостей на приглашение."""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    try:
        if event.get('httpMethod') == 'POST':
            body = json.loads(event.get('body') or '{}')
            name = (body.get('name') or '').strip()
            status = body.get('status')
            guests_count = int(body.get('guests_count') or 1)

            if not name or status not in ('attending', 'not_attending'):
                return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Неверные данные'})}

            cur.execute(
                "INSERT INTO rsvp (name, status, guests_count) VALUES (%s, %s, %s) RETURNING id",
                (name, status, guests_count)
            )
            rsvp_id = cur.fetchone()[0]
            conn.commit()
            return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'id': rsvp_id, 'ok': True})}

        # GET — список ответов
        cur.execute("SELECT name, status, guests_count, created_at FROM rsvp ORDER BY created_at DESC")
        rows = cur.fetchall()
        data = [
            {'name': r[0], 'status': r[1], 'guests_count': r[2], 'created_at': r[3].isoformat()}
            for r in rows
        ]
        attending = sum(r['guests_count'] for r in data if r['status'] == 'attending')
        return {
            'statusCode': 200,
            'headers': cors,
            'body': json.dumps({'rsvps': data, 'attending_count': attending})
        }
    finally:
        cur.close()
        conn.close()
