$(document).ready(function(){

    const selector = '.nav li';
    $(selector).removeClass('active');
    $("#nav-li-home").addClass('active'); 

    $("#barcode-details").hide()
    $("#barcode-list").html("")

    
    let server = "";
    function loadConfigFile() {
        $.ajax({
            url: '../../config/server.json',
            type: 'GET',
            async:false,
            success: function(response){
                server = response.server;
                console.log(server)	
            },
            error: function(error){
                console.log(error);
            }
        });

    };
    
    const origin =  window.location.origin;
    if(origin.indexOf('localhost') != -1){
        server = 'localhost'
    }else{
        loadConfigFile();
    }
        

    // const server = 'localhost'
    const base_url = 'http://'+server+':8100/api/CTM/' ;

    $(".form-submit").on('click', function(){
        const project_name = $("#project_name option:selected").val()
        const search_pattern = $("#search_pattern").val()
        console.log(project_name, search_pattern)
        if(project_name != '' && search_pattern != ''){
            generate_barcode(base_url,project_name, search_pattern)
        }else{
            alert('Please provide values')
        }
    })



    function generate_barcode(base_url, project_name, search_pattern) {
        $("#barcode-list").html("")
        const param = {'project_name': project_name, 'search_pattern': search_pattern}
        $.ajax({
            url: base_url+'generate_barcode',
            type: 'POST',
            data: param,
            dataType : 'json',
            success: function(response){
                console.log(response)
                const data = response['data']
                if(data.length > 0){
                    const barcoed_list = data[0]['file_list']
                    const barcoed_id = data[0]['b_id']
                    let barcode_li = '<ol>'
                    $.each(barcoed_list, function(key,val){
                        console.log(key,val)
                        barcode_li += '<li><span>'+val+'</span></li>'
                    })
                    barcode_li +='</ol>'
                    barcode_li +='<p> '+
                                '<button type="button" class="btn bg-info btn-md btn-flat col-2 float-right generate-config" data-id="'+barcoed_id+'">Generate Config file</button>'+
                                '</p>'
                    $("#barcode-list").html(barcode_li)
                    $("#barcode-details").show()
                }
               
            },
            error: function(error){
                console.log(error);
            }
        });   
    }

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
                console.log(response)
                const data = response['data']
                console.log(data.length)
                if(data.length > 0){
                    window.location.href='../../analysis.php'
                }
               
            },
            error: function(error){
                console.log(error);
            }
        });   
    }

});