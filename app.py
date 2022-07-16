from flask import Flask, url_for, jsonify
from flask import render_template
from flaskext.mysql import MySQL
from itsdangerous import json

app = Flask(__name__)

mysql = MySQL()
app.config['MYSQL_DATABASE_HOST']='localhost'
app.config['MYSQL_DATABASE_USER']='root'
app.config['MYSQL_DATABASE_PASSWORD']=''
app.config['MYSQL_DATABASE_BD']='por_el_mundo'
mysql.init_app(app)

@app.route('/')
def index():
    sql = """ SELECT id, titulo, fecha_publicacion, contenido, slug, imagenes 
		FROM por_el_mundo.publicaciones 
			WHERE portada=1; """
    conn  =mysql.connect()
    cursor=conn.cursor()
    cursor.execute(sql)
    destinos = cursor.fetchall()

    sql = """ SELECT id, titulo, fecha_publicacion, contenido, slug, imagenes 
		FROM por_el_mundo.publicaciones 
			WHERE principal=1; """
    cursor.execute(sql)
    principales = cursor.fetchall()
    print(principales)

    conn.commit()
    """return jsonify(destinos)"""
    return render_template('viajes/index.html' ,  destinos=destinos, principales=principales)

@app.route('/about')
def about():
    sql = """ SELECT id, texto, imagen 
		FROM por_el_mundo.acercade ; """
    conn  =mysql.connect()
    cursor=conn.cursor()
    cursor.execute(sql)
    detalles = cursor.fetchall()
    conn.commit()
    return render_template('viajes/about.html', detalles=detalles)

@app.route('/destacados')
def destacados():
    sql = """ SELECT id, titulo, fecha_publicacion, contenido, slug, imagenes 
		FROM por_el_mundo.publicaciones 
			WHERE destacados=1 ; """
    conn  =mysql.connect()
    cursor=conn.cursor()
    cursor.execute(sql)
    destacados = cursor.fetchall()
    conn.commit()
    return render_template('viajes/destacados.html', destacados=destacados)

@app.route("/contacto")
def contacto():
     return render_template('viajes/contacto.html')



if __name__=='__main__':
    app.run(debug=True)