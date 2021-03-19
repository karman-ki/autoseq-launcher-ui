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

                    project_list_table += '<tr>'+
                                '  <td>'+value['sample_id']+'</td>'+
                                '  <td>'+value['cfdna']+'</br>'+value['normal']+'</td>'+
                                '  <td>'+value['config_path']+'</td>'+
                                '  <td>'+value['create_time']+'</td>'+
                                '  <td><button type="button" class="btn bg-info btn-sm btn-flat start-pipeline" data-id="'+value['p_id']+'">Start</button>'+'</td>'+
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
                    "order": [[0, "desc" ]],
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