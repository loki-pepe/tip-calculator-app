document.addEventListener('DOMContentLoaded', () => {
    const FORM = document.querySelector('#calculator');
    const TIP = document.querySelector('#tip');
    const TOTAL = document.querySelector('#total');
    const RESET = document.querySelector('#clear');
    const BUTTONTIPS = document.querySelectorAll('#percent-buttons button');
    const CUSTOMTIP = document.querySelector('#custom');

    handleInput(FORM);

    FORM.addEventListener('submit', handleSubmit);
    FORM.addEventListener('input', () => handleInput(FORM));
    RESET.addEventListener('click', () => {
        unselect(BUTTONTIPS);
        toggleResetButton(false);
        FORM.reset();
        handleInput(FORM);
    });
    BUTTONTIPS.forEach(button => button.addEventListener('click', () => {
        CUSTOMTIP.value = '';
        setTip(button);
        toggleResetButton(true);
    }));
    CUSTOMTIP.addEventListener('input', () => unselect(BUTTONTIPS));


    function ceilToFloat(f, decimalDigits) {
        return Math.ceil(f * 10**decimalDigits) / 10**decimalDigits;
    }

    function checkSelection(nodes) {
        let selected = null;
        nodes.forEach(node => {
            if (node.classList.contains('selected')) {
                selected = node;
            }
        })
        return selected;
    }

    function getData(form) {
        return Object.fromEntries(new FormData(form));
    }

    function handleError(formField) {
        let message = 'Invalid.';
        if (formField.validity.badInput) {
            message = 'Must be a number';
        } else if (formField.validity.stepMismatch) {
            if (formField.id === 'bill') {
                message = 'Must be valid amount';
            } else {
                message = 'Must be whole number';
            }
        } else if (formField.validity.rangeUnderflow) {
            message = 'Must be positive number'
            if (formField.id === 'people') {
                if (formField.value === '0') message = 'Can\'t be zero';
            }
        }
        setErrorMessage(formField, message);
    }

    function handleInput(form) {
        if (!form.checkValidity()) {
            handleInvalidForm(form);
            toggleResetButton(true);
            updateUI(0, 0);
        } else {
            let {bill, tip, people} = parseData(getData(form));

            let selectedTip = checkSelection(BUTTONTIPS);
            if (selectedTip) {
                tip = parseInt(selectedTip.textContent);
            }

            toggleResetButton(!(isNaN(bill) && isNaN(tip) && isNaN(people)));

            let {tipPerPerson, totalPerPerson} = tipCalculator(bill, tip, people);
            updateUI(tipPerPerson, totalPerPerson);
        }
    }

    function handleInvalidForm(form) {
        form.querySelectorAll('input').forEach(input => {
            if (!input.checkValidity()) {
                handleError(input);
            }
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
    }

    function parseData(data) {
        let people = parseInt(data.people);
        let bill = parseFloat(data.bill);
        let tip = parseFloat(data.percent);
        
        return {bill, tip, people};
    }

    function setErrorMessage(formField, message) {
        let errorLabel = document.querySelector(`.error[for='${formField.id}']`);
        errorLabel.textContent = message;
    }

    function setTip(button) {
        unselect(BUTTONTIPS);
        button.classList.add('selected');
        handleInput(FORM);
    }

    function tipCalculator(bill, tipPercent, people) {
        let tip = tipPercent ? bill * tipPercent / 100 : 0;

        if (people === 1) {
            return {
                tipPerPerson: tip,
                totalPerPerson: bill + tip,
            }
        }

        let tipPerPerson = ceilToFloat(tip / people, 2);
        let totalPerPerson = ceilToFloat((bill + tip) / people, 2);

        return {tipPerPerson, totalPerPerson};
    }

    function toggleResetButton(bool) {
        if (bool) {
            RESET.removeAttribute('disabled');
        } else {
            RESET.setAttribute('disabled', '');
        }
    }

    function unselect(nodes) {
        nodes.forEach(node => node.classList.remove('selected'));
    }

    function updateUI(tip, total) {
        TIP.textContent = isNaN(tip) ? '0.00' : tip.toFixed(2);
        TOTAL.textContent = isNaN(total) ? '0.00' : total.toFixed(2);
    }
});
