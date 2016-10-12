# Email Checker &nbsp;&nbsp; [![Latest Stable Version](https://img.shields.io/badge/version-v1.0.4-green.svg?style=flat-square)](https://github.com/alexhoma/email-checker)

An easy-to-use tool to check the typos of your user emails.

### Methodology
- Selects the email input value.
- Splits the email by name, domain, and TLD.
- Sanitizes white spaces.
- Compares using Slevenshtein Distance if the email could be invalid.
- Reassemble the email with their corrected parts.


### Basic usage
Add this tag before head ends --> `<script type="text/javascript" src="/vendor/email-checker.min.js"></script>` <br>
Email checker only needs the id of the email input you want to check. Just remember to add a listener on this input to invoke the class when the element changes, like the example below:
```javascript
var emailInput = document.getElementById('email');
emailInput.addEventListener('change', function() {
    var c = new EmailChecker('email');
    c.check();
});
```

### Custom usage
#### 1. Mode:
Email Checker has two modes: 
- **Soft**: (default mode) Prints a suggestion of a possible valid email.
- **Hard**: Instead of a valid email suggestion, hard mode corrects the email directly.
```javascript
var c = new EmailChecker('email', {
    mode: 'hard' // -> default 'soft'
});
```

#### 2. Locales:
This method is not available in hard mode.<br>
There is a list of locales you can use. I'll show some examples:
```javascript
{
    en-EN  : 'Did you mean <%= email %>?',
    es-ES  : 'Querías decir <%= email %>?',
    ca-ES  : 'Volies dir <%= email %>?',
    pt-PT  : 'Você quis dizer <%= email %>?',
    it-IT  : 'Intendevi <%= email %>?',
    fr-FR  : 'Vouliez-vous dire <%= email %>?'
    // ...
}
```
Then just put the locale value:
```javascript
var c = new EmailChecker('email', {
    locale: 'haw-US' // -> default 'en-EN'
});
```

#### 3. Custom copy:
This method is not available in hard mode.<br>
You can put a custom copy if you don't like the default ones. This method will overwrite locales, so if you have enabled any, the locale won't work.
```javascript
var c = new EmailChecker('email', {
    copy: 'Why not <%= email %>, huh?'
});
```
Don't forget to put `<%= email %>` in your sentence to print the valid email in the suggestion.

#### 4. Distance:
This is to control the character distance between the 'invalid' email and the 'possible valid emails'.
```javascript
var c = new EmailChecker('email', {
    distance: 5 // -> default 1
});
```
This method is closely associated with the accuracy. The higher the number of distance characters the more dificult will be to find a fiable match.

#### 5. Accuracy:
The higher the accuracy, the more likely that matches the suggestion.
Accuracy values can be: `highest`, `high`, `medium`, `low`, `lowest`. I recommend to put your accuracy between `high` and `low`.
```javascript
var c = new EmailChecker('email', {
    accuracy: 'high' // -> default 'medium'
});
```

### Todo's
- Check/validation for Top Level Domains.
- Create customs blacklist and whitelist. Now must be updated. 
- Create all locales and add it as an optional external file.
- Support second TLD --> domain[.co.uk]
- Sanitize email for invalid characters and possible injections. --> encode
