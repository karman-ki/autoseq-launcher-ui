$(document).ready(function(){

    const selector = '.nav li';
    $(selector).removeClass('active');
    $("#nav-li-analysis").addClass('active'); 


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

    // const server = 'localhost'
    const base_url = 'http://'+server+':8100/api/CTM/' ;

    getProjectList()

    $(document).on("click", ".analysis-refresh", function(){
        $('#tb_project_list').DataTable().destroy();
        getProjectList()
    })

    $('#tb_project_list tfoot th').each( function () {
        var title = $(this).text();
        $(this).html( '<input type="text" class="input-sm" placeholder="'+title+'" />' );
     });

    function getProjectList() {
        $.ajax({
            url: base_url+'project_list',
            type: 'GET',
            dataType : 'json',
            success: function(response){
                let jsonData = response.data;
                let project_list_table = '';
        
                $.each(jsonData,function(key, value){
                    const project_status = value['pro_status'];
                    let button_info = '';
                    let edit_btn_enable = '';
                    let progress_color = 'bg-default';
                    if(project_status == '0'){
                        button_info = '<li><button type="button" class="btn bg-info btn-sm start-pipeline " data-id="'+value['p_id']+'">Start</button></li>';
                        progress_color = 'bg-info';
                    }else if(project_status == '1'){
                        edit_btn_enable = 'disabled';
                        progress_color = 'bg-primary';
                        button_info = '<li><button type="button" class="btn bg-primary btn-sm cursor-disable">Running</button></li><li><button type="button" class="btn bg-danger btn-sm stop-pipeline " data-id="'+value['p_id']+'">Stop</button></li>';
                    }else if(project_status == '2'){
                        progress_color = 'bg-danger';
                        button_info = '<li><button class="btn btn-sm bg-danger cursor-disable">Failed</button></li><li><button type="button" class="btn bg-secondary btn-sm start-pipeline " data-id="'+value['p_id']+'">Re-Start</button></li>';
                    }else if(project_status == '-2'){
                        progress_color = 'bg-danger';
                        button_info = '<li><button class="btn btn-sm bg-danger cursor-disable">Cancelled</button></li><li><button type="button" class="btn bg-secondary btn-sm start-pipeline " data-id="'+value['p_id']+'">Re-Start</button></li>';
                    }else if(project_status == '-1'){
                        edit_btn_enable = 'disabled';
                        progress_color = 'bg-success';
                        button_info = '<li><button class="btn btn-success btn-sm cursor-disable">Completed</button></li>';
                    }

                    sample_cfdna_t = value['cfdna']
                    if(sample_cfdna_t == "") {
                        sample_cfdna_t = value['tumor']
                    }
                    const percentage = parseInt(value['progress_bar'] == 'None' || value['progress_bar'] == 0 ? 1 : value['progress_bar'] );
                    project_list_table += '<tr>'+
                                '  <td>'+value['project_name']+'</td>'+
                                '  <td>'+value['sample_id']+'</td>'+
                                '  <td>'+sample_cfdna_t+'</td>'+
                                '  <td>'+value['normal']+'</td>'+
                                '  <td>'+value['cores']+' / '+value['machine_type']+'</td>'+
                                '  <td>'+value['create_time']+'</td>'+
                                '  <td>'+
                                '       <div class="progress">'+                                
                                '           <div class="progress-bar progress-bar-striped '+progress_color+'" role="progressbar" style="width: '+percentage+'%;" aria-valuenow="'+percentage+'" aria-valuemin="0" aria-valuemax="100">'+percentage+'%</div>'+
                                '       </div>'+
                                '  </td>'+
                                '  <td>'+
                                '   <ul class="analysis-status-ul">'+
                                        button_info+
                                        '<li><a class="btn btn-dark btn-sm btnEdit '+edit_btn_enable+'"  data-id="'+value['p_id']+'" href="#"><i class="fas fa-pencil-alt pr-1"></i>Edit</a></li>'+
                                '   </ul>'
                                '</td>'+
                                '</tr>';
                })
                $("#tb_project_list tbody").html(project_list_table);
                $('#tb_project_list').DataTable({
                    "processing": true,
                    "paging": true,
					"lengthChange": true,
					"searching": true,
					"ordering": true,
					"info": true,
					"autoWidth": true,
					"responsive": true,
                    "order": [[5, "desc" ]],
                    "columnDefs": [
                        { "width": "5%", "targets": 0 },
                        { "width": "5%", "targets": 1 },
                        { "width": "45%", "targets": 2 },
                        { "width": "10%", "targets": 3 },
                        { "width": "5%", "targets": 4 },
                        { "width": "5%", "targets": 5 },
                        { "width": "5%", "targets": 6 },
                        { "width": "20%", "targets": 7 },
                    ],
                    "language": {
                        "emptyTable": "No Project information available",
                        'loadingRecords': '&nbsp;',
                        'processing': '<div class="loader">Loading...</div>'
                    },
                    initComplete: function () {
                        // Apply the search
                        this.api().columns().every( function () {
                            var that = this;
             
                            $( 'input', this.footer() ).on( 'keyup change clear', function () {
                                if ( that.search() !== this.value ) {
                                    that
                                        .search( this.value )
                                        .draw();
                                }
                            } );
                        } );
                    }
                });
            },
            error: function(response, error){
                const err_text = response.responseJSON
                toastr['error'](err_text['error']);
            }
        });   
    }

    $(document).on("click", ".start-pipeline", function(){
        const p_id = $(this).attr('data-id');
        start_pipeline(p_id)
    })

    $(document).on("click", ".stop-pipeline", function(){
        const p_id = $(this).attr('data-id');
        stop_pipeline(p_id)
    })

    function stop_pipeline(p_id){
        const param = {'project_id': p_id}
        $.ajax({
            url: base_url+'stop_pipline',
            type: 'POST',
            data: param,
            dataType : 'json',
            success: function(response){
                if(response.data){
                    toastr['success'](response['data']);
                    $('#tb_project_list').DataTable().destroy();
                    getProjectList()
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

    $(document).on("click", ".btnEdit", function(){
        const p_id = $(this).attr('data-id');
        editCoreMacineInfo(p_id)
    })

    $(document).on("click", ".btnView", function(){
        const p_id = $(this).attr('data-id');
        viewCoreMacineInfo(p_id)
    })

    $(document).on("click", ".update-analysis-info", function(){
        const p_id = $("#project_id").val();
        const cores = $("#cores").val();
        const machine_type = $("#machine_type option:selected").val();
        updateAnalysisInfo(p_id, cores, machine_type)
    })

    function updateAnalysisInfo(p_id, cores, machine_type){
        const param = {'project_id': p_id, 'cores': cores, 'machine_type': machine_type}
        $.ajax({
            url: base_url+'update_analysis_info',
            type: 'POST',
            data: param,
            dataType : 'json',
            success: function(response){
                const data = response;
                if(data.status == true) {
                    toastr['success'](data['data']);
                    $("#editAnalysis").modal('toggle');
                    $('#tb_project_list').DataTable().destroy();
                    getProjectList()
                }else{
                    toastr['error'](data['error']);
                }
            },
            error: function(response, error){
                const err_text = response.responseJSON
                toastr['error'](err_text['error']);
            }
        }); 
    }

    function editCoreMacineInfo(p_id) {
        const param = {'project_id': p_id}
        $.ajax({
            url: base_url+'edit_analysis_info',
            type: 'POST',
            data: param,
            dataType : 'json',
            success: function(response){
                const data = response.data;
                if(data.length > 0){
                    $("#project_id").val(data[0]['p_id'])
                    $("#sample_id").val(data[0]['sample_id'])
                    $("#cores").val(data[0]['cores'] == 'None' ? '' : data[0]['cores'])
                    $("#machine_type").val(data[0]['machine_type'] == 'None' ? '' : data[0]['machine_type'])
                    $('#editAnalysis').modal({
                        keyboard: false,
                        backdrop : 'static'
                    })
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


    function viewCoreMacineInfo(p_id) {
        const param = {'project_id': p_id}
        $.ajax({
            url: base_url+'view_analysis_info',
            type: 'POST',
            data: param,
            dataType : 'json',
            success: function(response){
                const data = response.data;
                if(data.length > 0){
                    const d_len = data.length
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

    function start_pipeline(p_id) {
        const param = {'project_id': p_id}
        $.ajax({
            url: base_url+'start_pipline',
            type: 'POST',
            data: param,
            dataType : 'json',
            success: function(response){
                if(response.data){
                    toastr['success'](response['data']);
                    $('#tb_project_list').DataTable().destroy();
                    getProjectList()
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

    $(document).on("click", ".del-analysis", function(){
		const project_id = $(this).attr('data-id');
		delAnalysisInfo(project_id)
	})

	function delAnalysisInfo(project_id){
		const param = {'project_id': project_id}
        $.ajax({
            url: base_url+'del_analysis_info',
            type: 'POST',
            data: param,
            dataType : 'json',
            success: function(response){
                if(response.data){
                    toastr['success'](response['data']);
                    $('#tb_project_list').DataTable().destroy();
                    getProjectList()
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
