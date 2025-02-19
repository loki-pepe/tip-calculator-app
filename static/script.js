document.addEventListener('DOMContentLoaded', () => {
    const FORM = document.querySelector('#calculator');
    FORM.addEventListener('submit', handleSubmit);
    FORM.addEventListener('input', e => handleInput(e, FORM));
    const TIP = document.querySelector('#tip');
    const TOTAL = document.querySelector('#total');


    function getData(form) {
        return Object.fromEntries(new FormData(form));
    }

    function handleInput(e, form) {
        if (!form.checkValidity()) {
            updateUI(0, 0);
        } else {
            let [tip, total] = tipCalculator(getData(form));
            updateUI(tip, total);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
    }

    function ceilToFloat(f, decimalDigits) {
        return Math.ceil(f * 10**decimalDigits) / 10**decimalDigits;
    }

    function tipCalculator(data) {
        let people = parseInt(data.people);
        let bill = parseFloat(data.bill);
        let tipPercent = parseFloat(data.percent);

        let tip = tipPercent ? bill * tipPercent / 100 : 0;

        let tipPerPerson = ceilToFloat(tip / people, 2);
        let totalPerPerson = ceilToFloat((bill + tip) / people, 2);

        return [tipPerPerson, totalPerPerson];
    }

    function updateUI(tip, total) {
        TIP.textContent = tip.toFixed(2);
        TOTAL.textContent = total.toFixed(2);
    }
});
