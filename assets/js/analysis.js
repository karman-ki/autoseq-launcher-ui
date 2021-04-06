$(document).ready(function(){

    const selector = '.nav li';
    $(selector).removeClass('active');
    $("#nav-li-analysis").addClass('active'); 


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

    getProjectList()

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
                    const project_status = value['pro_status']
                    let button_info = ''
                    let edit_btn_enable = ''
                    if(project_status == '0'){
                        button_info = '<button type="button" class="btn bg-info btn-sm start-pipeline" data-id="'+value['p_id']+'">Yet to Start</button>';
                    }else if(project_status == '1'){
                        edit_btn_enable = 'disabled'
                        button_info = '<button type="button" class="btn bg-primary btn-sm">In-progress</button>';
                    }else if(project_status == '2'){
                        button_info = '<span class="btn btn-danger btn-sm mr-1">Failed</span> <button type="button" class="btn bg-secondary btn-sm start-pipeline" data-id="'+value['p_id']+'">Re-Start</button>';
                    }else if(project_status == '-1'){
                        button_info = '<span class="btn btn-success btn-sm">Completed</span>';
                    }

                    project_list_table += '<tr>'+
                                '  <td>'+value['project_name']+'</td>'+
                                '  <td>'+value['sample_id']+'</td>'+
                                '  <td>'+value['cfdna']+'</br>'+value['normal']+'</td>'+
                                '  <td>'+value['cores']+' / '+value['machine_type']+'</td>'+
                                '  <td>'+value['create_time']+'</td>'+
                                '  <td>'+button_info+'</td>'+
                                '  <td>'+
                                        // '<a class="btn btn-primary btn-sm btnView mr-1"  data-id="'+value['p_id']+'" href="#"><i class="fas fa-folder pr-1"></i>View</a>'+
                                        '<a class="btn btn-info btn-sm btnEdit '+edit_btn_enable+'"  data-id="'+value['p_id']+'" href="#"><i class="fas fa-pencil-alt pr-1"></i>Edit</a>'+
                                '</td>'+
                                '</tr>';
                })
                $("#tb_project_list tbody").html(project_list_table);
                $('#tb_project_list').DataTable({
                    "paging": true,
                    "lengthChange": true,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": false,
                    "responsive": true,
                    "order": [[4, "desc" ]],
                    "language": {
                    "emptyTable": "No Project information available"
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
            error: function(error){
                console.log(error);
            }
        });   
    }

    $(document).on("click", ".start-pipeline", function(){
        const p_id = $(this).attr('data-id');
        start_pipeline(p_id)
    })

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
            url: base_url+'updateAnalysisInfo',
            type: 'POST',
            data: param,
            dataType : 'json',
            success: function(response){
                const data = response.data;
                if(data.status == true) {                
                    $("#editAnalysis").modal('toggle');
                    $('#tb_project_list').DataTable().destroy();
                    getProjectList()
                }
            },
            error: function(error){
                console.log(error);
            }
        }); 
    }

    function editCoreMacineInfo(p_id) {
        const param = {'project_id': p_id}
        $.ajax({
            url: base_url+'editAnalysisInfo',
            type: 'POST',
            data: param,
            dataType : 'json',
            success: function(response){
                const data = response.data;
                $("#project_id").val(data[0]['p_id'])
                $("#sample_id").val(data[0]['sample_id'])
                $("#cores").val(data[0]['cores'] == 'None' ? '' : data[0]['cores'])
                $("#machine_type").val(data[0]['machine_type'] == 'None' ? '' : data[0]['machine_type'])
                $('#editAnalysis').modal({
                    keyboard: false,
                    backdrop : 'static'
                })

            },
            error: function(error){
                console.log(error);
            }
        }); 
    }


    function viewCoreMacineInfo(p_id) {
        const param = {'project_id': p_id}
        $.ajax({
            url: base_url+'viewAnalysisInfo',
            type: 'POST',
            data: param,
            dataType : 'json',
            success: function(response){
                const data = response.data;
                console.log(data)

            },
            error: function(error){
                console.log(error);
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
                $('#tb_project_list').DataTable().destroy();
                getProjectList()
            },
            error: function(error){
                console.log(error);
            }
        }); 
    }

});