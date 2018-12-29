$(document).ready(function () {

    // Get Category Code and display as buttons
    var jsonCategories; 
    var totalPrice = 0; 
    ajaxGetCategory(); 

    $("#submit").click(function(event) {
        event.preventDefault(); 
        addItem(this); 
    })

    function ajaxGetCategory() {
        $.ajax({
            url: "http://192.168.1.230:6006/api/Categories/ByMerchant?merchant=Costco", 
            type: "GET", 
            dataType: "json", 
            crossDomain: true, 
            success: function(jsonCategories) {
                $("#divCostcoCategories").empty(); 
                $.each(jsonCategories, function(i, category){
                    var temp = "<input type='radio' value='" + category.DisplayName + "' id='" + 
                        category.CategoryId + "' name='category'>" + 
                        category.DisplayName;
                    $("#divCostcoCategories").append(temp);  
                })
            }, 
            error: function(error) {
                alert(error); 
            }
        });
    }

    function addItem(x) {
        var selectedCategory = $("input[name='category']:checked").val();
        var inputPrice = $("#price").val();
        var selectedTaxType = $("input[name='taxType']:checked").val(); 
        if (selectedCategory)
        var calculatedPrice = 0; 
        switch (selectedTaxType) {
            case "noTax":
                calculatedPrice = Number(inputPrice); 
                break;
            case "taxFP": 
                calculatedPrice = Number(inputPrice) * 1.1495; 
                break; 
            case "taxF": 
                calculatedPrice = Number(inputPrice) * 1.05; 
            default:
                break;
        }
        var tableRowsIndex = $("#tbodyListByInput")[0].rows.length;
        var row = document.getElementById("tableListByInput").insertRow(tableRowsIndex);
        var cell0 = row.insertCell(0); 
        cell0.innerHTML = tableRowsIndex; 
        var cell1 = row.insertCell(1); 
        cell1.innerHTML = selectedCategory; 
        var cell2 = row.insertCell(2); 
        cell2.innerHTML = selectedTaxType; 
        var cell3 = row.insertCell(3); 
        cell3.innerHTML = inputPrice; 
        var cell4 = row.insertCell(4); 
        cell4.innerHTML = calculatedPrice; 

        totalPrice += calculatedPrice; 
        $("#totalPrice")[0].innerHTML = totalPrice; 
    }

})