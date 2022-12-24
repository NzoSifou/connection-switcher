// @ts-nocheck
var select = document.getElementById("adapter");
var enableBtn = document.getElementById("enable");
var disableBtn = document.getElementById("disable");
window.api.handleAdapter(function (event, adapter) {
    window.api.handleDefaultAdapter(function (event, defaultAdapter) {
        document.getElementById("selectedAdapter").innerText = defaultAdapter;
        for (var i = 0; i < adapter.length; i++) {
            var option = document.createElement("option");
            option.appendChild(document.createTextNode(adapter[i][3]));
            option.setAttribute("value", adapter[i][3]);
            if (option.value == defaultAdapter)
                option.setAttribute("selected", true);
            select.appendChild(option);
        }
    });
});
select.addEventListener("change", function () {
    document.getElementById('selectedAdapter').innerText = select.options[select.selectedIndex].text;
    window.api.setAdapter(select.options[select.selectedIndex].text);
});
enableBtn.addEventListener("click", function () {
    window.api.setState("enable");
});
disableBtn.addEventListener("click", function () {
    window.api.setState("disable");
});
//# sourceMappingURL=renderer.js.map