import connection


@connection.connection_handler
def get_user_by_name(cursor, user_name, email):
    cursor.execute("""
                   SELECT *
                   FROM users
                   WHERE  user_name = %(user_name)s or email = %(email)s
                    """,
                   {"user_name": user_name, "email": email})
    return cursor.fetchone()


@connection.connection_handler
def add_user(cursor, user_name, email, password):
    cursor.execute("""
                    INSERT INTO users(user_name, email, password)
                    VALUES (%(user_name)s, %(email)s, %(password)s)
                    RETURNING id;""",
                   {"user_name": user_name, "email": email, "password": password})
    return cursor.fetchone()["id"]
