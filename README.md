# Email Checker (email-checker.js)
It's an easy-to-use tool to check the typos of your user emails.

### Methodology
- Selects the email input value.
- Splits the email by name, domain, and TLD.
- Sanitizes white spaces.
- Compares using Slevenshtein Distance if the email could be invalid.
- Reassemble the email with their corrected parts.


### Basic usage
Email checker only needs the id of the email input you want to check. Just remember to add a listener on this input to invoke the class when the element changes, like the example below:
```javascript
var emailInput = document.getElementById('email');
emailInput.addEventListener('change', function() {
    var c = new EmailChecker('email');
    c.check();
});
```

### Custom usage
#### Mode:
Email Checker has two modes: 
- **Soft**: (default mode) Prints a suggestion of a possible valid email.
- **Hard**: Instead of a valid email suggestion, hard mode corrects the email directly.
```javascript
var c = new EmailChecker('email', {
    mode: 'hard' // -> default 'soft'
});
```

#### Locales:
This method is not available in hard mode.
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

#### Custom copy:
This method is not available in hard mode.
You can aslo put a custom copy if you don't like the default ones. This method will overwrite locales, so if you have enabled any, the locale won't work.
```javascript
var c = new EmailChecker('email', {
    copy: 'Why not <%= email %>, huh?'
});
```
Don't forget to put `<%= email %>` in your sentence to print the valid email in the suggestion.

#### Distance:


#### Accuracy:
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
