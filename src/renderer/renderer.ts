// @ts-nocheck
let select = document.getElementById("adapter");
let enableBtn = document.getElementById("enable");
let disableBtn = document.getElementById("disable");

window.api.handleAdapter(function (event, adapter) {
    window.api.handleDefaultAdapter((event, defaultAdapter) => {
        document.getElementById("selectedAdapter").innerText = defaultAdapter;
        for (let i = 0; i < adapter.length; i++) {
            let option = document.createElement("option");
            option.appendChild(document.createTextNode(adapter[i][3]));
            option.setAttribute("value", adapter[i][3]);
            if(option.value == defaultAdapter) option.setAttribute("selected", true);
            select.appendChild(option);
        }
    });
});

select.addEventListener("change", function() {
    document.getElementById('selectedAdapter').innerText = select.options[select.selectedIndex].text;
    window.api.setAdapter(select.options[select.selectedIndex].text)
});

enableBtn.addEventListener("click", function() {
    window.api.setState("enable")
});

disableBtn.addEventListener("click", function() {
    window.api.setState("disable")
});
