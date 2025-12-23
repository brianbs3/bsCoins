$(document).ready(() => {
    $('#lookupProductInput').keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
           lookupProduct();
        }
    });
});

saveCoin = () => {
    // alert('saving coin')
    const d = new Date();
        

    const data = {

    
     "date": d.toISOString(),
        "attributes": {
            "year": $('#coinYear').val(),
            "denomination": $('#coinDenomination').val(),
            "metal": $('#coinMetal').val(),
            "mint": $('#coinMint').val(),
            "hasMintMark": ($('#coinHasMintMark').is(':checked')) ? true : false,
            "condition": $('#coinCondition').val(),
            "grade": $('#coinGrade').val(),
            "cameFrom": $('#coinCameFrom').val(),
            "tag": $('#coinTag').val(),
        },
        "mintage": 0,
        "GSID": 0,
        "errors": [$('#coinErrors').val()],
        "notes": [$('#coinNotes').val()]
    }
    console.log(data)
    
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        url: `/coins/add`,
        success: function (d) {
            console.log(d)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.readyState == 0)
                window.location.replace(global_site_redirect);
            $("#bsNetworkStatus").html(jqXHR);
        }
    });
    // console.log(data);
}

setUpAddCoin = () => {
    let maxTag = 0;
    $.ajax({
        type: 'GET',
        url: `/coins`,
        success: function (data) {
            Object.keys(data).forEach((v) => {
                t = parseInt(data[v].attributes.tag);
                maxTag = (t > maxTag) ? t : maxTag;
            })
            $('#coinTag').val(maxTag+1);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error")
        }
    });
}
lookupProduct = () => {
    const upc = $('#lookupProductInput').val();
    if(isStringInt(upc)){
        if (upc.length !== 7 && upc.length !== 11 && upc.length !== 12 && upc.length !== 13 && upc.length !== 14){
            $('#ccc_toast_body').html(`Invlid UPC length of ${upc.length}`)
            $('#ccc_toast').show()
            setTimeout(() => { $('#ccc_toast').hide() }, 3000)
        }
        else{
            $('#ccc_toast_body').html(`Looking up ${upc}`)
            $('#ccc_toast').show()
            $.ajax({
                    type: 'GET',
                    url: `/products/lookup/${upc}`,
                    success: function (data) {
                        if(data && Object.keys(data).length > 0){
                            
                            $('#lookupProductDescription').val(data.description)
                            $('#lookupProductBrand').val(data.brand)
                            $('#lookupProductCategory').val(data.category)
                            $('#lookupProductSize').val(data.size)
                            $('#lookupProductSource').val(data.source)

                            // if(item.images){
                            //     let imgSrc = "";
                            //     Object.keys(item.images).forEach((v) =>{
                            //         console.log(item.images[v]);
                            //         imgSrc += `<img width=200 height=200 src='${item.images[v]}'><br>`
                            //     })
                            //     $('#itemPics').html(imgSrc);
                            // }
                            
                        }
                        else{
                            $('#lookupProductDescription').val("NOT FOUND")
                            $('#lookupProductCategory').val("NOT FOUND")
                            $('#lookupProductSize').val("NOT FOUND")
                            $('#lookupProductBrand').val("NOT FOUND")
                            $('#lookupProductSource').val("MANUAL")
                        }
                        $('#ccc_toast').hide()
                        
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    console.log("error")
                    }
                });
        }
    }
    else{
        $('#ccc_toast_body').html(`${upc} is not a number`)
        $('#ccc_toast').show()
        setTimeout(() => { $('#ccc_toast').hide() }, 3000)
    }
    
    
}

populateAllCoinsTable = () => {
    $.ajax({
        type: 'GET',
        url: `/coins`,
        success: function (data) {
            $('#root').html(`
                <h2>Found ${data.length} Items</h2>
                <table width=100% class="table table-striped table-dark">
                <thead><th>#</th><th>Tag</th><th>Year</th><th>Denomination</th><th>Mint</th><th>Has MM</th><th>Condition</th><th>Grade</th><th>Source</th><th>Metal</th><th>Created</th><th>Errors</th><th>Notes</th></thead>
                <tbody id=allCoinsBody>`);
            let count = 0;
            Object.keys(data).forEach((k, v) => {
                const d = data[k]
                const a = d.attributes
                
                if(d){
                    $('#allCoinsBody').append(
                        `<tr>
                    <td>${++count}</td>
                    <td><a href=# data-toggle="modal" data-target="#addProductModal" onClick='productDetails("${a.tag}")'>${a.tag}</a></td>
                    <td>${a.year}</td>
                    <td>${a.denomination}</td>
                    <td>${a.mint}</td>
                    <td>${a.hasMintMark}</td>
                    <td>${a.condition}</td>
                    <td>${a.grade}</td>
                    <td>${a.cameFrom}</td>
                    <td>${a.metal}</td>
                    <td>${d.date}</td>
                    <td>${d.errors}</td>
                    <td>${d.notes}</td>
                </tr>`
                    );
                }
                
                
            })
                $('#allProductBody').append(
                `</tbody>
                </table>`)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error")
        }
    });
    
}

isStringInt = (str) => {
    const num = Number(str); // Attempt to convert the string to a number
    return Number.isInteger(num) && !isNaN(num);
}

clearCoinForm = () => {
    $('#coinTag').val('').focus();
    $('#coinYear').val('')
    $('#coinDenomination').val('')
    $('#coinMint').val('')
    $('#coinCondition').val('')
    $('#coinGrade').val('')
    $('#coinCameFrom').val('')
    $('#coinMetal').val('')
    $('#coinMintage').val('')
    $('#coinGSID').val('')
    $('#coinErrors').val('')
    $('#coinNotes').val('')
    setUpAddCoin();
}

getProductDetails = (upc) => {
    $.ajax({
        type: 'GET',
        url: `/products/details/${upc}`,
        success: function (data) {
            console.log(data)
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error")
        }
    });

}


productDetails = (upc) => {
    $('#lookupProductInput').val(upc);
    lookupProduct();
}

truncateString = (str, maxLength=20) => {
    if (str && str.length > maxLength) {
        // If the string is longer than maxLength, truncate and add ellipsis
        return str.slice(0, maxLength - 3) + '...';
    } else {
        // Otherwise, return the original string
        return str;
    }
}

useThisImage = (imgURL, upc) => {
    console.log(`we're going to use this image: ${imgURL}`)
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({url: `${imgURL}`}),
        url: `/products/download_image/${upc}`,
        success: function (d) {
            console.log(d)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.readyState == 0)
                window.location.replace(global_site_redirect);
            $("#bsNetworkStatus").html(jqXHR);
        }
    });
}