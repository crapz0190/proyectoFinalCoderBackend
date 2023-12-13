PROYECTO BACKEND

---------------- Getting Started with NodeJS ------

In the project directory, you can run:

<<< npm start >>>


---------------- La pagina inicia en LOGIN ---------------

http://localhost:8080/login ---> <<< ingresar con email y contraseña, sino se posee cuenta resgistrada redirecciona a SIGNUP >>>

http://localhost:8080/signup ---> <<< permite crear una cuenta de usuario >>>



---------------- visualizacion de todos los productos ----------------

ir a: http://localhost:8080/productos

---> permite hacer paginacion (pie de página)


---------------- Navegacion por ruta ----------------

ir a: http://localhost:8080/productos?limit="%%%"&page="%%%"&order="%%%"&category="%%%"

- ejemplo --> limit=5 (por defecto es de 10) 
- ejemplo --> page=3 (por defecto es de 1) 
- ejemplo --> order=-1 (ascendente=1 || descendente=-1) 
- ejemplo --> category=deportes (categorias: 1-tecnologia; 2-electrodomesticos; 3-herramientas; 4-deportes)


---------------- FORMULARIOS ----------------

http://localhost:8080/product-upload-form ---> <<< permite agregar productos >>>

http://localhost:8080/update-product ---> <<< permite actualizar o eliminar productos, tambien se puede navegar por pagina >>>
http://localhost:8080/update-product?page="%%%"



---------------- Mensajes ----------------

ir a: http://localhost:8080/messages-form ---> <<< permite crear mensajes y tambien actualizar o eliminar mensajes >>>
