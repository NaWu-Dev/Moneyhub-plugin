$(document).ready(function () {

    // Get Category Code and display as buttons
    var jsonCategories; 
    var totalCalculatedPrice = 0, totalInputPrice = 0, totalCalculatedTax = 0; 
    var categoryTotalInputPrice = 0, categoryTotalTax = 0, categoryTotalCalculatedPrice = 0; 
    var arrayCategories = [];
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
                    var categoryFontSize = 12
                    if (category.Count_of_Expense <= 12){
                       categoryFontSize = 12     
                    }
                    else {
                        categoryFontSize= Math.min(category.Count_of_Expense/12,3)*12

                    }
                    var temp = "<input type='radio' value='" + category.DisplayName + "' id='" + 
                        category.CategoryId + "' name='category'>" + 
                        "<span style='font-size:"+categoryFontSize+"px'>"+category.DisplayName+"</span>";
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
        var selectedCategoryId = $("input[name='category']:checked").attr("id");
        var inputPrice = Number($("#price").val());
        var selectedTaxType = $("input[name='taxType']:checked").val(); 

        if (selectedCategory == undefined || selectedTaxType == undefined || inputPrice == 0) {
            alert ("Please enter or select valid value. "); 
            return; 
        }

        var calculatedPrice = 0, calculatedTax = 0;
        switch (selectedTaxType) {
            case "noTax":
                calculatedTax = 0; 
                calculatedPrice = inputPrice; 
                break;
            case "taxFP": 
                calculatedTax = inputPrice * 0.1495; 
                calculatedPrice = inputPrice * 1.1495; 
                break; 
            case "taxF": 
                calculatedTax = inputPrice * 0.05; 
                calculatedPrice = inputPrice * 1.05; 
            default:
                break;
        }
        var tableRowsIndex = $("#tbodyListByInput")[0].rows.length;
        var rowForListByInput; 
        rowForListByInput = "<tr><td>" + tableRowsIndex + "</td>" + 
                        "<td>" + selectedCategory + "</td>" + 
                        "<td>" + selectedTaxType + "</td>" + 
                        "<td>" + inputPrice + "</td>" + 
                        "<td>" + calculatedTax + "</td>" + 
                        "<td>" + calculatedPrice + "</td>" + 
                        "</tr>"; 
        $("#tbodyListByInput:last").append(rowForListByInput);

        // Total price
        totalCalculatedPrice += calculatedPrice; 
        totalInputPrice += inputPrice; 
        totalCalculatedTax += calculatedTax; 
        $("#totalInputPrice")[0].innerHTML = totalInputPrice; 
        $("#totalCalculatedPrice")[0].innerHTML = totalCalculatedPrice; 
        $("#totalCalculatedTax")[0].innerHTML = totalCalculatedTax; 

        // Add to Category Array
        if (arrayCategories.length == 0) {
            arrayCategories.push({'CategoryId': selectedCategoryId, 
                            'CategoryName': selectedCategory, 
                            'CategoryInputPrice': inputPrice, 
                            'CategoryCalculatedTax': calculatedTax, 
                            'CategoryCalculatedPrice': calculatedPrice}); 
        } else {
            var found = false; 
            $.map(arrayCategories, function(val) {
                if (val.CategoryId == selectedCategoryId) {
                    val.CategoryInputPrice += inputPrice; 
                    val.CategoryCalculatedTax += calculatedTax; 
                    val.CategoryCalculatedPrice += calculatedPrice; 
                    found = true; 
                }
            })
            if (!found) {
                arrayCategories.push({'CategoryId': selectedCategoryId, 
                                'CategoryName': selectedCategory, 
                                'CategoryInputPrice': inputPrice, 
                                'CategoryCalculatedTax': calculatedTax, 
                                'CategoryCalculatedPrice': calculatedPrice}); 
            }
        }
        categoryTotalInputPrice += inputPrice; 
        categoryTotalTax += calculatedTax; 
        categoryTotalCalculatedPrice += calculatedPrice;

        // tableListByCategory
        var rowForListByCategory; 
        $("#tbodyListByCategory").empty(); 
        for (var i = 0; i < arrayCategories.length; i++ ) {
            rowForListByCategory = "<tr><td>" + arrayCategories[i].CategoryName + "</td>" + 
                        "<td>" + arrayCategories[i].CategoryInputPrice + "</td>" + 
                        "<td>" + arrayCategories[i].CategoryCalculatedTax + "</td>" + 
                        "<td>" + arrayCategories[i].CategoryCalculatedPrice + "</td>" + 
                        "</tr>"; 
            $("#tbodyListByCategory:last").append(rowForListByCategory);
        }        
        $("#categoryTotalInputPrice")[0].innerHTML = categoryTotalInputPrice; 
        $("#categoryTotalCalculatedPrice")[0].innerHTML = categoryTotalCalculatedPrice; 
        $("#categoryTotalCalculatedTax")[0].innerHTML = categoryTotalTax; 
        

    }

})