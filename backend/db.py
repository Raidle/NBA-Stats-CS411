import pymysql
import os

from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME"),
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
            # cursor.description is None for INSERT/UPDATE/DELETE statements.
            if cursor.description is None:
                conn.commit()
                return {
                    "affectedRows": cursor.rowcount,
                    "lastrowid": cursor.lastrowid,
                }

            results = cursor.fetchall()
        return results
    finally:
        conn.close()
