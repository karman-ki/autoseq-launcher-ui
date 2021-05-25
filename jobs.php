<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Autoseq-Launcher | Jobs</title>
	<?php $path = getcwd()."/layout/"; include($path."header_link.php"); ?>

</head>
<body class="hold-transition layout-top-nav">
	<div class="wrapper">
		<?php $path = getcwd()."/layout/"; include($path."navigation.php"); ?>
		<!-- Content Wrapper. Contains page content -->
		<div class="content-wrapper">
			<!-- Content Header (Page header) -->
			<div class="content-header">
				<div class="container-fluid">
					<div class="row mb-2">
						<div class="col-sm-6">
							<h5 class="m-0 text-uppercase"> List of Jobs</h5>
						</div><!-- /.col -->
						<div class="col-sm-6">
						<button type="button" class="btn btn-md btn btn-outline-info float-right job-refresh"><i class="fas fa-sync-alt"></i> Refresh</button>
						</div><!-- /.col -->
					</div><!-- /.row -->
				</div><!-- /.container-fluid -->
			</div>
			<!-- /.content-header -->

			<div class="content">
				<div class="container-fluid">
					<div class="row">
						<div class="col">
							<div class="card card-info card-outline">
								<div class="card-body">
									<div class="table-responsive">
										<table id="tb_job_list" class="table table-bordered table-hover">
											<thead>
												<tr>
													<th>#</th>
													<th>Project ID</th>
													<th>Pipeline Command</th>
													<th>Job status</th>  
													<th>Create Time</th>
													<th>Action</th>
												</tr>
											</thead>
											<tfoot>
												<tr>
													<th>#</th>
													<th>Project_id</th>
													<th>Pipeline Command</th>
													<th>Job status</th>  
													<th>Create Time</th>
													<th>Action</th>
												</tr>
											</tfoot>
											<tbody>
												</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- Main Footer -->
		<?php $path = getcwd()."/layout/"; include($path."footer.php"); ?>
	</div>
	<div class="modal  bd-example-modal-xl" tabindex="-1" role="dialog" id="viewLogModal">
		<div class="modal-dialog modal-xl" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Log Information</h5>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col">
							<p id="logContent"></p>
						</div>  
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>
<!-- ./wrapper -->

<!-- REQUIRED SCRIPTS -->
<?php $path = getcwd()."/layout/"; include($path."footer_link.php"); ?>

<script src="assets/js/jobs.js"></script>

</body>
</html>
