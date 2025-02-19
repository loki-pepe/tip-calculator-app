document.addEventListener('DOMContentLoaded', () => {
    const FORM = document.querySelector('#calculator');
    const TIP = document.querySelector('#tip');
    const TOTAL = document.querySelector('#total');
    const RESET = document.querySelector('#clear');

    FORM.addEventListener('submit', handleSubmit);
    FORM.addEventListener('input', () => handleInput(FORM));
    RESET.addEventListener('click', () => {
        FORM.reset();
        toggleResetButton(false);
    })



    function ceilToFloat(f, decimalDigits) {
        return Math.ceil(f * 10**decimalDigits) / 10**decimalDigits;
    }

    function getData(form) {
        return Object.fromEntries(new FormData(form));
    }

    function handleInput(form) {
        if (!form.checkValidity()) {
            toggleResetButton(true);
            updateUI(0, 0);
        } else {
            let {bill, tip, people} = parseData(getData(form));

            toggleResetButton(!(isNaN(bill) && isNaN(tip) && isNaN(people)));

            let {tipPerPerson, totalPerPerson} = tipCalculator(bill, tip, people);
            updateUI(tipPerPerson, totalPerPerson);
        }
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

    function updateUI(tip, total) {
        TIP.textContent = isNaN(tip) ? '0.00' : tip.toFixed(2);
        TOTAL.textContent = isNaN(total) ? '0.00' : total.toFixed(2);
    }
});
