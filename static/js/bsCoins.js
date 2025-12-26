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
            setUpAddCoin()
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

coinDetails = (tag) => {
    $.ajax({
        type: 'GET',
        url: `/coins/coin/${tag}`,
        success: function (data) {
            
            const a = data[0].attributes;
            
            $('#coinTag').val(a.tag).focus();
            $('#coinYear').val(a.year)
            $('#coinDenomination').val(a.denomination)
            $('#coinMint').val(a.mint)
            $('#coinCondition').val(a.condition)
            $('#coinGrade').val(a.grade)
            $('#coinCameFrom').val(a.cameFrom)
            $('#coinMetal').val(a.metal)
            $('#coinMintage').val(a.mintage)
            $('#coinGSID').val(a.GSID)
            // $('#coinErrors').val('')
            // $('#coinNotes').val('')
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error")
        }
    });
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
                    <td><a href=# data-toggle="modal" data-target="#addCoinModal" onClick='coinDetails("${a.tag}")'>${a.tag}</a></td>
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

truncateString = (str, maxLength=20) => {
    if (str && str.length > maxLength) {
        // If the string is longer than maxLength, truncate and add ellipsis
        return str.slice(0, maxLength - 3) + '...';
    } else {
        // Otherwise, return the original string
        return str;
    }
}

exportCoinCollection = () => {
    try{
        const d = new Date();
        $.ajax({
            type: 'GET',
            url: `/coins/pdf`,
            dataType: 'binary',
            xhrFields: {
                responseType: 'blob'
            },
            processData: true,
            success: function (data) {
                let blob = new Blob([data], { type: 'application/pdf' });
                let link = document.createElement('a');
                const filename = `bsCoins - ${d.toISOString()}.pdf`

                link.href = window.URL.createObjectURL(blob);
                link.setAttribute('download', filename);
                link.setAttribute('filename', filename)
                link.click();
                window.open(link.href, '_blank');
                
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error")
            }
        });
    }
    catch (error) {
        console.log('there was an error exporting the collection')
        console.log(error)
    }
}