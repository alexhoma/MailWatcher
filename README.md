# Email Checker (email-checker.js)
An easy to use email checker for typos in domain names.

## Description
Corrector de emails erróneos o que es muy probable que lo sean.

- Selecciona el string del email por el id de su input.
- Divide el email por partes (nombre, dominio y TLD).
- Sanea espacios y caracteres vacíos.
- Compara por tres aproximaciones si el email es válido o no.
- Vuelve a montar el email con sus partes corregidas o no.
- Modifica el valor del input del email.

El core de la funcionalidad está basado en el algoritmo de [Distancia de Levenshtein](https://es.wikipedia.org/wiki/Distancia_de_Levenshtein).

### Example:
![dentificacion de cliente20160414134821](https://cloud.githubusercontent.com/assets/7917771/14527120/0e637b04-0248-11e6-88d9-fdd243cd3df1.gif)

## Usage

1. Añadir libreria en el `head` -> `<script type="text/javascript" src="/vendor/emailChecker.js"></script>`
2. Añadir evento en el input de email a corregir:

```javascript
var emailInput = document.getElementById('billing:email');
emailInput.addEventListener('change', function() {
    emailChecker.check(this);
});
```

## Todo's

- Implementar correcciones para los TLD's.
- Implementar matchings más precisos para el comparador de cadenas.
- Acotar mejor el saneador de elementos.
