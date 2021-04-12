$(document).ready(function(){

    const selector = '.nav li';
    $(selector).removeClass('active');
    $("#nav-li-home").addClass('active'); 

    $("#barcode-details").hide()
    $("#barcode-list").html("")

    
    toastr.options = {
        "closeButton": true,
        "debug": true,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    let server = "";
    function loadConfigFile() {
        $.ajax({
            url: '../../config/server.json',
            type: 'GET',
            async:false,
            success: function(response){
                server = response.server;
            },
            error: function(error){
                toastr['error'](error);
            }
        });

    };
    
    const origin =  window.location.origin;
    if(origin.indexOf('localhost') != -1){
        server = 'localhost'
    }else{
        loadConfigFile();
    }

    $("#sample_processing_step").on("change", function() {
        const sample_option = $(this).val();
        $(".single-sample, .multiple-sample").hide()
        $("."+sample_option).show()
        $("#barcode-details").hide()
        $("#barcode-list").html("")
        $("input:text").val("");
        $(".custom-file-label").html("");
        $(".custom-file-input").val("");
    })
        
    // const server = 'localhost'
    const base_url = 'http://'+server+':8100/api/CTM/' ;
    const regex_dict = {'PROBIO': /^(PB-P-)(.*)/, 'PSFF' : /^(PSFF-P-)(.*)/};

    $(".custom-file-input").on("change", function() {
        const fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    })

    $(".form-submit").on('click', function(){
        const project_name = $("#project_name option:selected").val()
        const orderform_file = $(".custom-file-input").val()
        if(project_name != '' && orderform_file != ''){
            const fileUpload = $("#orderFormfile")[0];
            getSampleInfo(fileUpload, project_name)
        }else{
            toastr["error"]("Please provide mandatory fields.")
        }
    })

    $(".search-sample-submit").on('click', function(){
        const project_name = $("#project_name option:selected").val()
        const ssid = $("#ssid").val()
        const sid = $("#sid-1").val() + ',' + $("#sid-2").val()
        const germline = $("#germline").val()

        if(project_name != '' && ssid != '' && sid != '' && germline != ''){
            sample_generate_barcode(base_url, project_name, ssid, sid, germline)
        }else{
            toastr["error"]("Please provide mandatory fields.")
        }
    })

    function getSampleInfo(fileUpload, project_name){
        const regex = /^([\W\S.]*)\.xls[xm]?$/;
        let sample_list = ''
        if (regex.test(fileUpload.value.toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                const reader = new FileReader();
                //For Browsers other than IE.
                let file_path = fileUpload.value.toLowerCase();
                const file_name = file_path.split('\\').slice(-1)[0];
                if (reader.readAsBinaryString) {
                    reader.onload = function (e) {
                        processExcel(e.target.result, project_name, file_name);
                    };
                    sample_list = reader.readAsBinaryString(fileUpload.files[0]);
                } else {
                    //For IE Browser.
                    reader.onload = function (e) {
                        const data = "";
                        const bytes = new Uint8Array(e.target.result);
                        for (const i = 0; i < bytes.byteLength; i++) {
                            data += String.fromCharCode(bytes[i]);
                        }
                        processExcel(data, project_name, file_name);
                    };
                    sample_list = reader.readAsArrayBuffer(fileUpload.files[0]);
                }
            } else {
                toastr["error"]("This browser does not support HTML5.");
            }
        } else {
            toastr["error"]("Please upload a valid Excel file.");
        }

    }

    function processExcel(data, project_name, file_name) {

        const regex_patt = regex_dict[project_name]
       //Read the Excel File data.
       const workbook = XLSX.read(data, {
            type: 'binary'
        });

        //Fetch the name of First Sheet.
        const validSheetName = 'orderform';
        let sheetName = 'orderform'
        $.each(workbook.SheetNames, function(key, value){
        if(validSheetName == value.toLowerCase()){
            sheetName = value
        }
        })
        //Read all rows from First Sheet into an JSON array.
        const excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

        let sample_arr =  ''
        //Add the data rows from Excel file.
        for (let i = 0; i < excelRows.length; i++) {
            //Add the data row.
            const sample_name = excelRows[i]['__EMPTY'];
            if (regex_patt.test(sample_name)) {
                sample_arr += excelRows[i]['__EMPTY'] +','
            }
        }
        console.log(sample_arr)
        // generate_barcode(base_url,project_name, '',sample_arr.replace(/,\s*$/, ""), file_name)
        uploadOrderform(base_url,project_name, sample_arr.replace(/,\s*$/, ""), file_name)
    }

    function uploadOrderform(base_url, project_name, sample_arr, file_name){
        $("#barcode-list").html('<div class="loader">Loading...</div>')
        $("#barcode-details").show()

        const param = {'project_name': project_name, 'sample_arr': sample_arr, 'file_name': file_name}
        $.ajax({
            url: base_url+'upload_orderform',
            type: 'POST',
            data: param,
            dataType : 'json',
            success: function(response){
                const data = response['data']
                if(data.length > 0){
                    const barcoed_list = data[0]['file_list']
                    const barcoed_id = data[0]['b_id']
                    let barcode_li = '<ol>'
                    $.each(barcoed_list, function(key,val){
                        barcode_li += '<li><span>'+val+'</span></li>'
                    })
                    barcode_li +='</ol>'
                    barcode_li +='<p> '+
                                '<button type="button" class="btn bg-info btn-md btn-flat col-2 float-right generate-config" data-id="'+barcoed_id+'">Generate Config file</button>'+
                                '</p>'
                    $("#barcode-list").html(barcode_li)
                    $("#barcode-details").show()
                    toastr['success']('Barcode generate successfully')
                }else{
                    toastr['error'](response['error'])
                    $("#barcode-details").hide()
                }
               
            },
            error: function(response, error){
                const err_text = response.responseJSON
                toastr['error'](err_text['error']);
            }
        });
    }

    function sample_generate_barcode(base_url, project_name, ssid, sid, germline){
        $("#barcode-list").html('<div class="loader">Loading...</div>')
        $("#barcode-details").show()

        const param = {'project_name': project_name, 'ssid': ssid, 'sid': sid, 'germline': germline}
        $.ajax({
            url: base_url+'sample_generate_barcode',
            type: 'POST',
            data: param,
            dataType : 'json',
            success: function(response){
                const data = response['data']
                if(data.length > 0){
                    const barcoed_list = data[0]['file_list']
                    const barcoed_id = data[0]['b_id']
                    let barcode_li = '<ol>'
                    $.each(barcoed_list, function(key,val){
                        barcode_li += '<li><span>'+val+'</span></li>'
                    })
                    barcode_li +='</ol>'
                    barcode_li +='<p> '+
                                '<button type="button" class="btn bg-info btn-md btn-flat col-2 float-right generate-config" data-id="'+barcoed_id+'">Generate Config file</button>'+
                                '</p>'
                    $("#barcode-list").html(barcode_li)
                    $("#barcode-details").show()
                    toastr['success']('Barcode generate successfully')
                }else{
                    toastr['error'](response['error'])
                    $("#barcode-details").hide()
                }
               
            },
            error: function(response, error){
                const err_text = response.responseJSON
                toastr['error'](err_text['error']);
            }
        });
    }

    // function generate_barcode(base_url, project_name, search_pattern, orderfromList, file_name) {
    //     $("#barcode-list").html('<div class="loader">Loading...</div>')
    //     $("#barcode-details").show()
    //     const param = {'project_name': project_name, 'search_pattern': search_pattern, 'sample_arr': orderfromList, 'file_name': file_name}
    //     $.ajax({
    //         url: base_url+'generate_barcode',
    //         type: 'POST',
    //         data: param,
    //         dataType : 'json',
    //         success: function(response){
    //             const data = response['data']
    //             if(data.length > 0){
    //                 const barcoed_list = data[0]['file_list']
    //                 const barcoed_id = data[0]['b_id']
    //                 let barcode_li = '<ol>'
    //                 $.each(barcoed_list, function(key,val){
    //                     barcode_li += '<li><span>'+val+'</span></li>'
    //                 })
    //                 barcode_li +='</ol>'
    //                 barcode_li +='<p> '+
    //                             '<button type="button" class="btn bg-info btn-md btn-flat col-2 float-right generate-config" data-id="'+barcoed_id+'">Generate Config file</button>'+
    //                             '</p>'
    //                 $("#barcode-list").html(barcode_li)
    //                 $("#barcode-details").show()
    //                 toastr['success']('Barcode generate successfully')
    //             }else{
    //                 toastr['error'](response['error'])
    //                 $("#barcode-details").hide()
    //             }
               
    //         },
    //         error: function(response, error){
    //             const err_text = response.responseJSON
    //             toastr['error'](err_text['error']);
    //         }
    //     });   
    // }

    $(document).on("click", ".generate-config", function(){
        const bar_id = $(this).attr('data-id');
        generate_config(bar_id, base_url)
    })

    function generate_config(bar_id, base_url){

        const param = {'barcode_id': bar_id}
        $.ajax({
            url: base_url+'generate_config',
            type: 'POST',
            data: param,
            dataType : 'json',
            success: function(response){
                const data = response['data']
                if(data.length > 0){
                    toastr['success']('Generate Config file')
                    window.location.href='../../analysis.php'
                }else{
                    toastr['error'](response['error'])
                }
            },
            error: function(response, error){
                const err_text = response.responseJSON
                toastr['error'](err_text['error']);
            }
        });   
    }

});