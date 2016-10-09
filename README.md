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
#### Hard mode:
```javascript
var c = new EmailChecker('email', {
    
});
c.check();
```

### Todo's

- Check/validation for Top Level Domains.
- Create customs blacklist and whitelist. Now must be updated 
- Create all locales and add it as an optional external file.
