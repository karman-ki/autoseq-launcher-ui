$(document).ready(function(){

    const selector = '.nav li';
    $(selector).removeClass('active');
    $("#nav-li-home").addClass('active'); 

    $("#barcode-details").hide()
    $("#barcode-list").html("")

    const max_fields      = 3;
    const wrapper         = $(".input_fields_wrap"); 

    
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

    $('#togglePassword').on('click', function (e) {
        const input = $("#password");
        const type = input.attr('type') === 'password' ? 'text' : 'password';
        input.attr('type', type);
        $(this).toggleClass("fa-eye fa-eye-slash");
        
    });

    $("#sample_processing_step").on("change", function() {
        const sample_option = $(this).val();
        $(".sample, .upload").hide()
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
        const anch_user = $("#username").val().trim();
        const anch_pwd = $("#password").val().trim();
        const project_name = $("#project_name option:selected").val();
        const orderform_file = $(".custom-file-input").val();
        if(project_name != "" && orderform_file != ""){
            const fileUpload = $("#orderFormfile")[0];
            getSampleInfo(fileUpload, project_name, anch_user, anch_pwd);
        }else{
            toastr["error"]("Please provide mandatory fields.")
        }
    })

    $(".add-btn").on('click', function(e){
        e.preventDefault();
        var total_fields = wrapper[0].childNodes.length;
        if(total_fields < max_fields){

            const divContent = '<div class="row add-new-row" id="add_'+total_fields+'" d-id='+total_fields+'>'+
            '    <div class="col-7">'+
            '        <div class="row">'+
            '           <div class="col">'+
            '               <div class="form-group">'+
            '                   <label class="mandatory">SID1 <small>(sample name)</small></label>'+
            '                   <div class="mb-3">'+
            '                       <input type="text" class="form-control" id="cfdna_sid1_'+total_fields+'" placeholder="*-P-*-CFDNA-*-KH*-C3*">'+
            '                   </div>'+
            '               </div>'+
            '           </div>'+
            '           <div class="col">'+
            '               <div class="form-group">'+
            '                   <label>SID2 <small>(sample name)</small></label>'+
            '                   <div class="mb-3">'+
            '                       <input type="text" class="form-control" id="cfdna_sid2_'+total_fields+'" placeholder="*-P-*-CFDNA-*-KH*-C3*">'+
            '                    </div>'+
            '                </div>'+
            '               </div>'+
            '          </div>'+
            '    </div>'+
            '    <div class="col-4 vertical-line">'+
            '        <div class="row">'+
            '            <div class="col">'+
            '                <div class="form-group">'+
            '                    <label class="mandatory">SID <small>(sample name)</small></label>'+
            '                    <div class="mb-3">'+
            '                    <input type="text" class="form-control" id="germline_sid_'+total_fields+'" placeholder="*-P-*-N-*-KH*-C3*">'+
            '                    </div>'+
            '                </div>'+
            '            </div>'+
            '        </div>'+
            '    </div>'+
            '    <div class="col-1">'+
            '        <div class="form-group float-right">'+
            '        <button type="button" class="btn btn-sm btn-danger remove-btn" data-id='+total_fields+'><i class="fas fa-minus"></i></button>'+
            '        </div>'+
            '    </div>'+
            '</div>';
	

            $(wrapper).append(divContent);
        }
    })

    $(document).on("click", ".remove-btn", function(){
        const total_fields = $(this).attr('data-id');
        $("#add_"+total_fields).remove();

    })

    $(document).on("click", ".search-sample-submit", function(){
        let sample_list = []
        const anch_user = $("#username").val().trim();
        const anch_pwd = $("#password").val().trim();
        const project_name = $("#project_name option:selected").val().trim();
        const cfdna_sid = $("#cfdna_sid1").val().trim();
        const sid = cfdna_sid + ',' + $("#cfdna_sid2").val().trim();
        const germline_sid = $("#germline_sid").val().trim();

        const normal_val = germline_sid;
        sample_list.push(normal_val);

        $.each(sid.split(','), function(key, val){
            if(val){
                sample_list.push(val);
            }
        })

        let validate_boolean = false;
        const counter = wrapper[0].childNodes.length - 1;
        
        if(counter > 0){
            $(".input_fields_wrap .add-new-row").each(function(idx, el){
                const i = $("#"+this.id).attr('d-id');

                const sid_1 = $("#cfdna_sid1_"+i).val();
                const germline_sid_1 = $("#germline_sid_"+i).val();
                
                if(sid_1 != "" && germline_sid_1 != "" ){
                    const sid_str = $("#cfdna_sid1_"+i).val() + ',' + $("#cfdna_sid2_"+i).val();
                    validate_boolean = true;
                    sample_list.push(germline_sid_1);

                    $.each(sid_str.split(','), function(key, val){
                        if(val){
                            sample_list.push(val);
                        }
                    })
                } else {
                    validate_boolean = false;
                    return false;
                }
            })
        }else{
            validate_boolean = true;
        }
        
        if(anch_user != "" && anch_pwd != "" && project_name != "" && cfdna_sid != "" && germline_sid != "" && validate_boolean && sample_list){
            sample_generate_barcode(base_url, anch_user, anch_pwd,project_name, sample_list.join());
        }else{
            toastr["error"]("Please provide mandatory fields.")
        }
    })

    function getSampleInfo(fileUpload, project_name, anch_user, anch_pwd){
        const regex = /^([\W\S.]*)\.xls[xm]?$/;
        let sample_list = ""
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
                        processExcel(data, project_name, file_name, anch_user, anch_pwd);
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

    function processExcel(data, project_name, file_name, anch_user, anch_pwd) {

        const regex_patt = regex_dict[project_name];
       //Read the Excel File data.
       const workbook = XLSX.read(data, {
            type: 'binary'
        });

        //Fetch the name of First Sheet.
        const validSheetName = 'orderform';
        let sheetName = 'orderform';
        $.each(workbook.SheetNames, function(key, value){
            if(validSheetName == value.toLowerCase()){
                sheetName = value;
            }
        })
        //Read all rows from First Sheet into an JSON array.
        const excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

        let sample_arr =  "";
        //Add the data rows from Excel file.
        for (let i = 0; i < excelRows.length; i++) {
            //Add the data row.
            const sample_name = excelRows[i]['__EMPTY'];
            if (regex_patt.test(sample_name)) {
                sample_arr += excelRows[i]['__EMPTY'] +',';
            }
        }
        uploadOrderform(base_url,project_name, sample_arr.replace(/,\s*$/, ""), file_name, anch_user, anch_pwd);
    }

    function uploadOrderform(base_url, project_name, sample_arr, file_name, anch_user, anch_pwd){
        $("#barcode-list").html('<div class="loader">Loading...</div>');
        $("#barcode-details").show();

        const param = {'project_name': project_name, 'sample_arr': sample_arr, 'file_name': file_name, "anch_user": anch_user, "anch_pwd": anch_pwd};
        $.ajax({
            url: base_url+'upload_orderform',
            type: 'POST',
            data: param,
            dataType : 'json',
            success: function(response){
                const data = response['data'];
                if(data.length > 0){
                    const barcoed_list = data[0]['file_list'];
                    const barcoed_id = data[0]['b_id'];
                    let barcode_li = '<ol>';
                    $.each(barcoed_list, function(key,val){
                        barcode_li += '<li><span>'+val+'</span></li>';
                    })
                    barcode_li +='</ol>';
                    barcode_li +='<p> '+
                                '<button type="button" class="btn bg-success btn-md btn-flat col-1 float-right generate-config" data-id="'+barcoed_id+'">Create Analysis List</button>'+
                                '</p>';
                    $("#barcode-list").html(barcode_li);
                    $("#barcode-details").show();
                    toastr['success']('Barcode generate successfully');
                }else{
                    toastr['error'](response['error']);
                    $("#barcode-details").hide();
                }
               
            },
            error: function(response, error){
                const err_text = response.responseJSON;
                toastr['error'](err_text);
            }
        });
    }

    function sample_generate_barcode(base_url, anch_user, anch_pwd, project_name, sample_list){
        $("#barcode-list").html('<div class="loader">Loading...</div>');
        $("#barcode-details").show();
        const param = {'project_name': project_name, 'samples': sample_list, "anch_user": anch_user, "anch_pwd": anch_pwd};
        $.ajax({
            url: base_url+'sample_generate_barcode',
            type: 'POST',
            data: param,
            dataType : 'json',
            success: function(response){
                const data = response['data'];
                if(data.length > 0){
                    const barcoed_list = data[0]['file_list'];
                    const barcoed_id = data[0]['b_id'];
                    let barcode_li = '<ol>';
                    $.each(barcoed_list, function(key,val){
                        barcode_li += '<li><span>'+val+'</span></li>';
                    })
                    barcode_li +='</ol>';
                    barcode_li +='<p> '+
                                '<button type="button" class="btn bg-success btn-md col-1 float-right generate-config" data-id="'+barcoed_id+'">Create Analysis List</button>'+
                                '</p>';
                    $("#barcode-list").html(barcode_li);
                    $("#barcode-details").show();
                    toastr['success']('Barcode generate successfully');
                }else{
                    toastr['error'](response['error']);
                    $("#barcode-details").hide();
                }
               
            },
            error: function(response, error){
                const err_text = response.responseJSON;
                toastr['error'](err_text);
            }
        });
    }


    $(document).on("click", ".generate-config", function(){
        const bar_id = $(this).attr('data-id');
        generate_config(bar_id, base_url);
    })

    function generate_config(bar_id, base_url){

        const param = {'barcode_id': bar_id};
        $.ajax({
            url: base_url+'generate_config',
            type: 'POST',
            data: param,
            dataType : 'json',
            success: function(response){
                const data = response['data'];
                if(data.length > 0){
                    toastr['success']('Generate Config file');
                    window.location.href='../../analysis.php';
                }else{
                    toastr['error'](response['error']);
                }
            },
            error: function(response, error){
                const err_text = response.responseJSON;
                toastr['error'](err_text);
            }
        });   
    }

});
