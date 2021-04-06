$(document).ready(function(){

    const selector = '.nav li';
    $(selector).removeClass('active');
    $("#nav-li-job").addClass('active'); 

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

    getJobList()

    $('#tb_job_list tfoot th').each( function () {
        var title = $(this).text();
        $(this).html( '<input type="text" class="input-sm" placeholder="'+title+'" />' );
     });


    function getJobList() {
        $.ajax({
            url: base_url+'job_list',
            type: 'GET',
            dataType : 'json',
            success: function(response){
                let jsonData = response.data;
                let project_list_table = '';
        
                $.each(jsonData,function(key, value){
                    const project_status = value['job_status']
                    let status_info = ''
                    if(project_status == '0'){
                        status_info = '<span class="btn btn-info btn-sm">In-progess</span>';
                    }else if(project_status == '1'){
                        status_info = '<span class="btn btn-warning btn-sm">Warning</span>';
                    }else if(project_status == '2'){
                        status_info = '<span class="btn btn-danger btn-sm">Failed</span>';
                    }else if(project_status == '-1'){
                        status_info = '<span class="btn btn-success btn-sm">Completed</span>';
                    }

                    project_list_table += '<tr>'+
                                '  <td>'+value['job_id']+'</td>'+
                                '  <td>'+value['sample_id']+'</td>'+
                                '  <td>'+value['cores']+'</br>'+value['machine_type']+'</td>'+
                                '  <td>'+status_info+'</td>'+
                                '  <td>'+value['create_time']+'</td>'+
                                '  <td>'+value['update_time']+'</td>'+
                                '  <td><a class="btn btn-primary btn-sm btnLogView"  data-id="'+value['job_id']+'" href="#"><i class="fas fa-folder pr-1"></i>Log</a></td>'+
                                '</tr>';
                })
                $("#tb_job_list tbody").html(project_list_table);
                $('#tb_job_list').DataTable({
                    "paging": true,
                    "lengthChange": true,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": false,
                    "responsive": true,
                    "order": [[0, "desc" ]],
                    "language": {
                    "emptyTable": "No Job information available"
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

    $(document).on("click", ".btnLogView", function(){
        const job_id = $(this).attr('data-id');
        getLoginfo(job_id)
    })

    function getLoginfo(job_id){
        const param = {'job_id': job_id}
        $.ajax({
            url: base_url+'getPipelineLog',
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

});