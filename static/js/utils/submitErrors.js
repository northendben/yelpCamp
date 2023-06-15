function errorForm (status,message) {
    let eF = document.createElement('form');
    eF.setAttribute('method', 'post');
    eF.setAttribute('action', '/errors');
    let messageField = document.createElement('input');
    let statusField = document.createElement('input');
    messageField.setAttribute('type', 'hidden');
    messageField.setAttribute('name', 'message');
    messageField.setAttribute('value', message);
    statusField.setAttribute('type', 'hidden');
    statusField.setAttribute('name', 'status');
    statusField.setAttribute('value', status);
    eF.appendChild(messageField)
    eF.appendChild(statusField)
    document.body.appendChild(eF);
    eF.submit()
}