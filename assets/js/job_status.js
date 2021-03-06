$(document).ready(function(){

	const selector = '.nav li';
	$(selector).removeClass('active');

	let currentURL = window.location.href.split('=');
	current_arr= currentURL[1].split('&')
  	const job_id = current_arr[0];
	const project_id = current_arr[1];

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

	getJobStatusInfo(job_id)

	$('#tb_job_status_list tfoot th').each( function () {
		var title = $(this).text();
		$(this).html( '<input type="text" class="input-sm" placeholder="'+title+'" />' );
	 });

	
	$(document).on("click", ".analysis-refresh", function(){
        $('#tb_job_status_list').DataTable().destroy();
        getJobStatusInfo(job_id)
    })

	$("#project_id").html(project_id)
	$("#status").html('-')
	$("#startTime").html('-')
	$("#endTime").html('-')
	$("#noJobs").html('-')
	$("#complete").html('-')
	$("#cancel").html('-')
	$("#fail").html('-')

	function initDatatable(){
		$('#tb_job_status_list').DataTable({
			'processing': true,
			"paging": true,
			"lengthChange": true,
			"searching": true,
			"ordering": true,
			"info": true,
			"autoWidth": false,
			"responsive": false,
			"order": [[0, "asc" ]],
			"language": {
				"emptyTable": "No Job Status information available",
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
	}

	$(document).on("click", ".view-out-path", function(){
		const out_job_path = $(this).html();
		getOutLoginfo(out_job_path)
	})

	function getOutLoginfo(out_job_path){
		const param = {'out_path': out_job_path}
		$.ajax({
			url: base_url+'get_out_log_info',
			type: 'POST',
			data: param,
			dataType : 'json',
			success: function(response){
				const data = response.data;
				if(data.length > 0){
					let out_log_content = '<ul class="list-group">'
					data_arr = data.split('\n')
					$.each(data_arr, function(key, val){
						val = val.replace('\n', '');
						if(val){
							out_log_content += '<li class="list-group-item"><p>'+val+'</p></li>'
						}
					})
					out_log_content += '</ul>'
					$("#outLogContent").html(out_log_content);
					$('#viewOutLogModal').modal({
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
				initDatatable()
			}
		}); 
	}
	function getJobStatusInfo(job_id){
		const param = {'job_id': job_id}
		$.ajax({
			url: base_url+'get_job_status',
			type: 'POST',
			data: param,
			dataType : 'json',
			success: function(response){
				const json_data = response.data;
				if(!$.isEmptyObject(json_data)){
					const job_status = json_data['status'];
					const job_startTime = (json_data['starttime'] == '' || json_data['starttime'] == null ? '-' : json_data['starttime'].split('T')[0]);
					const job_endTime = (json_data['endtime'] == '' || json_data['endtime'] == null ? '-' : json_data['endtime'].split('T')[0]);
					const job_list = json_data['jobs']

					$("#project_id").html(project_id)
					$("#status").html(job_status)
					$("#startTime").html(job_startTime)
					$("#endTime").html(job_endTime)
					$("#noJobs").html(job_list.length)
					let complete_count = 0;
					let cancel_count = 0;
					let fail_count = 0;
					let run_count = 0;
					let pending_count = 0;

					let job_status_list_table = ''
					$.each(job_list, function(key, value){
						let status_class = (value['status'] == "COMPLETED" ? 'text-success' : ( value['status'] == "CANCELLED" || value['status'] == "FAILED") ? 'text-danger' : ( value['status'] == "PENDING") ? 'text-warning' : 'text-info')
						complete_count = (value['status'] == "COMPLETED" ? complete_count+=1 : complete_count)
						cancel_count = (value['status'] == "CANCELLED" ? cancel_count+=1 : cancel_count)
						fail_count = (value['status'] == "FAILED" ? fail_count+=1 : fail_count)
						pending_count = (value['status'] == "PENDING" ? pending_count+=1 : pending_count)
						run_count = (value['status'] == "RUNNING" ? run_count+=1 : run_count)



						job_status_list_table += '<tr>'+
								'  <td>'+value['jobid']+'</td>'+
								'  <td>'+value['jobname']+'</td>'+
								'  <td><span class="font-weight-bold '+status_class+'">'+value['status']+'</span></td>'+
								'  <td><a href="#" class="view-out-path">'+value['log']+'</a></td>'+
								'  <td>'+value['starttime']+'</td>'+
								'  <td>'+value['endtime']+'</td>'+
								'</tr>';
					})
					$("#tb_job_status_list tbody").html(job_status_list_table);
					initDatatable()

					$("#complete").html(complete_count)
					$("#cancel").html(cancel_count)
					$("#fail").html(fail_count)
					$("#running").html(run_count)
					$("#pending").html(pending_count)
					
					$('#viewJobModal').modal({
						keyboard: false,
						backdrop : 'static'
					})
				}else{
					toastr['error'](response['error']);
					initDatatable()
				}
				
			},
			error: function(response, error){
				const err_text = response.responseJSON
				toastr['error'](err_text['error']);
				initDatatable()
			}
		}); 
	}

	
});
