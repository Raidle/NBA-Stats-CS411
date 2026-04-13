import pymysql

DB_CONFIG = {
    "host": "34.16.1.113", 
    "user": "team020user",
    "password": "bigOenergy",
    "database": "nba_analytics",
    "cursorclass": pymysql.cursors.DictCursor
}

# Testing
# python -c "from db import run_query; print(run_query('SELECT COUNT(*) as c FROM Player'))"

def get_connection():
    return pymysql.connect(**DB_CONFIG)

def run_query(sql, params=None):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql, params)
            results = cursor.fetchall()
        return results
    finally:
        conn.close()
