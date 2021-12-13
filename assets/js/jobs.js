$(document).ready(function(){

	const selector = '.nav li';
	$(selector).removeClass('active');
	$("#nav-li-job").addClass('active'); 

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

	getJobList()

	$('#tb_job_list tfoot th').each( function () {
		var title = $(this).text();
		$(this).html( '<input type="text" class="input-sm" placeholder="'+title+'" />' );
	 });

	$(document).on("click", ".job-refresh", function(){
	    $('#tb_job_list').DataTable().destroy();
	    getJobList()
	})

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
						status_info = '<span class="text-info font-weight-bold">Running</span>';
					}else if(project_status == '1'){
						status_info = '<span class="text-warning font-weight-bold">Warning</span>';
					}else if(project_status == '2'){
						status_info = '<span class="text-danger font-weight-bold">Failed</span>';
					}else if(project_status == '-2'){
                                                status_info = '<span class="text-danger font-weight-bold">Cancelled</span>';
                                        }else if(project_status == '-1'){
						status_info = '<span class="text-success font-weight-bold">Completed</span>';
					}

					project_list_table += '<tr>'+
								'  <td>'+value['job_id']+'</td>'+
								'  <td>'+value['sample_id']+'</td>'+
								// '  <td>'+value['cores']+'</br>'+value['machine_type']+'</td>'+
								'  <td><small>'+value['pipeline_cmd']+'</small></td>'+
								'  <td>'+status_info+'</td>'+
								'  <td>'+value['create_time']+'</td>'+
								'  <td>'+
									'<a class="btn btn-outline-info btn-sm btnLogView m-1"  data-id="'+value['job_id']+'" href="#"><i class="fas fa-file pr-1"></i>Logs</a>'+
									'<a class="btn btn-outline-primary btn-sm"  href="jobs_status.php?id='+value['job_id']+'&'+value['sample_id']+'"><i class="fas fa-tasks pr-1"></i>Flow & Status</a>'+
									// '<a class="btn btn-outline-danger btn-sm del-job" data-id="'+value['job_id']+'" href="#">Delete</a>'+
								'</td>'+
								'</tr>';
				})
				$("#tb_job_list tbody").html(project_list_table);
				$('#tb_job_list').DataTable({
					'processing': true,
					"paging": true,
					"lengthChange": true,
					"searching": true,
					"ordering": true,
					"info": true,
					"autoWidth": false,
					"responsive": false,
					"order": [[4, "desc" ]],
					"columnDefs": [
						{ "width": "2%", "targets": 0 },
						{ "width": "2%", "targets": 1 },
						{ "width": "90%", "targets": 2 },
						{ "width": "2%", "targets": 3 },
						{ "width": "2%", "targets": 4 },
						{ "width": "2%", "targets": 5 },
					],
					"language": {
						"emptyTable": "No Job information available",
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

	$(document).on("click", ".btnLogView", function(){
		const job_id = $(this).attr('data-id');
		getLoginfo(job_id)
	})

	function getLoginfo(job_id){
		const param = {'job_id': job_id}
		$.ajax({
			url: base_url+'view_pipeline_log',
			type: 'POST',
			data: param,
			dataType : 'json',
			success: function(response){
				const data = response.data;
				if(data.length > 0){
					let log_content = '<ul class="log-list">'
					data_arr = data.split(/INFO|WARNING|DEBUG|ERROR|CRITICAL|\n/)
					$.each(data_arr, function(key, val){
						val = val.replace('\n', '');
						if(val){
							log_content += '<li class="log-items"><p>'+val+'</p></li>'
						}
					})
					log_content += '</ul>'
					$("#logContent").html(log_content);
					$('#viewLogModal').modal({
						keyboard: false,
						backdrop : 'static'
					})
				}else{
					toastr['error'](response['error']);
				}
			},
			error: function(response, error){
				const err_text = response.responseJSON
				toastr['error'](err_text['error']);
			}
		}); 
	}

	$(document).on("click", ".del-job", function(){
		const job_id = $(this).attr('data-id');
		delJobInfo(job_id)
	})

	function delJobInfo(job_id){
		const param = {'job_id': job_id}
        $.ajax({
            url: base_url+'del_job_info',
            type: 'POST',
            data: param,
            dataType : 'json',
            success: function(response){
                if(response.data){
                    toastr['success'](response['data']);
                    $('#tb_job_list').DataTable().destroy();
	    			getJobList()
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
