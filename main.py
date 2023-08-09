from flask import Flask, render_template, url_for, request, session, redirect
import bcrypt as bcrypt
from dotenv import load_dotenv
from util import json_response
import mimetypes
import config
from data_handler import boards_handler, cards_handler, status_handler, users_handler

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()

app.secret_key = "96449384-97ca-4e24-bdec-58a7dc8f59fc"


@app.route('/registration', methods=['POST', 'GET'])
def registration():
    if request.method == 'GET':
        return render_template("registration.html")
    else:
        user_name = request.form['user_name']
        email = request.form['email']
        password = request.form['password']
        repeat_password = request.form['repeat_password']

        errors = []

        if not password == repeat_password:
            errors.append("Passwords not match")

        if len(password) not in config.PASSWORD_LENGTH:
            errors.append(f"Password should have from {config.PASSWORD_LENGTH_MIN} to {config.PASSWORD_LENGTH_MAX} "
                          f"characters.")
        if len(user_name) not in config.USERNAME_LENGTH:
            errors.append(f"Username should have from {config.USERNAME_LENGTH_MIN} to {config.USERNAME_LENGTH_MAX} "
                          f"characters.")
        if users_handler.get_user_by_name(user_name, email):
            errors.append("User with this name or email already exists.")
        if len(errors):
            return render_template("registration.html", errors=errors)

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        user_id = users_handler.add_user(user_name, email, hashed_password.decode("utf-8"))

        if user_id:
            return render_template("registration_confirm.html")
        else:
            return render_template("registration.html", errors='Unknown error, please try later.')


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'GET':
        return render_template("login.html")
    else:
        user_name_email = request.form['user_name_email']
        password = request.form['password']
        errors = []
        user = users_handler.get_user_by_name(user_name_email, user_name_email)
        if not user:
            errors.append(f'{user_name_email} not exist')
            return render_template("login.html", errors=errors)

        is_password_correct = bcrypt.checkpw(password.encode("utf-8"), user['password'].encode("utf-8"))

        if is_password_correct:
            session['user_name_email'] = user_name_email
            session['is_logged'] = True
            session['user_id'] = user['id']
            # return redirect(f"/user/{user['id']}")
            return redirect("/")
        else:
            return render_template("login.html", errors=['Password incorrect!'])


def is_logged():
    return "is_logged" in session and session["is_logged"]


@app.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect("/")


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return boards_handler.get_boards()


@app.route("/api/boards/<int:board_id>")
@json_response
def get_board(board_id: int):
    return  boards_handler.get_board(board_id)


@app.route("/api/new_board", methods=['POST'])
@json_response
def create_new_board():
    data = request.json
    boards_handler.add_board(data['title'])
    return data


@app.route("/api/new_card/", methods=['POST'])
@json_response
def create_new_card():
    data = request.json
    cards_handler.add_card(data['board_id'], data['status_id'], data['title'])
    return data


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return cards_handler.get_cards_for_board(board_id)


@app.route("/api/boards/statuses/")
@json_response
def get_statuses():
    return status_handler.get_statuses()


@app.route("/api/boards/statuses/<int:status_id>")
@json_response
def get_status(status_id):
    return status_handler.get_card_status(status_id)


@app.route("/api/card/")
@json_response
def get_card():
    return 'cards_handler.get_card_by_id'


@app.route("/api/delete_board/<int:board_id>", methods=['DELETE'])
@json_response
def delete_board(board_id):
    return boards_handler.delete_board_by_id(board_id)


@app.route("/api/delete_card/<int:card_id>", methods=['DELETE'])
@json_response
def delete_card(card_id):
    return cards_handler.delete_card_by_id(card_id)


@app.route("/api/update_board", methods=['PATCH'])
@json_response
def update_board():
    data = request.json
    boards_handler.update_board_by_id(data['board_id'], data['title'])
    return data


@app.route("/api/update_card", methods=['PATCH'])
@json_response
def update_card_title():
    data = request.json
    cards_handler.update_card_title_by_id(data['card_id'], data['title'])
    return data


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
