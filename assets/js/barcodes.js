$(document).ready(function(){

	const selector = '.nav li';
	$(selector).removeClass('active');
	$("#nav-li-barcodes").addClass('active'); 

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

	getBarcodeList()

	$('#tb_barcode_list tfoot th').each( function () {
		var title = $(this).text();
		$(this).html( '<input type="text" class="input-sm" placeholder="'+title+'" />' );
	 });

	$(document).on("click", ".barcode-refresh", function(){
	    $('#tb_barcode_list').DataTable().destroy();
	    getBarcodeList()
	})

	function getBarcodeList() {
		$.ajax({
			url: base_url+'barcode_list',
			type: 'GET',
			dataType : 'json',
			success: function(response){
				let jsonData = response.data;
				let barcode_list_table = '';
		
				$.each(jsonData,function(key, value){
					

					barcode_list_table += '<tr>'+
								'  <td>'+value['b_id']+'</td>'+
								'  <td>'+value['project_name']+'</td>'+
								'  <td>'+(value['launch_step'] == '0' ? 'Upload Orderform' : 'Sample ID and barcodes' )+'</td>'+
								'  <td>'+value['barcode_path']+'</td>'+
								'  <td>'+value['config_path']+'</td>'+
								'  <td>'+value['create_time']+'</td>'+
								'</tr>';
				})
				$("#tb_barcode_list tbody").html(barcode_list_table);
				$('#tb_barcode_list').DataTable({
					'processing': true,
					"paging": true,
					"lengthChange": true,
					"searching": true,
					"ordering": true,
					"info": true,
					"autoWidth": false,
					"responsive": false,
					"order": [[0, "desc" ]],
					"language": {
						"emptyTable": "No Barcode information available",
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
});