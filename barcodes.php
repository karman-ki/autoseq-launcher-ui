<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Autoseq-Launcher | Barcodes</title>
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
						<h5 class="m-0 text-uppercase"> List of Barcodes</h5>
					</div><!-- /.col -->
					<div class="col-sm-6">
					<button type="button" class="btn btn-md btn btn-outline-info float-right barcode-refresh"><i class="fas fa-sync-alt"></i> Refresh</button>
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
									<table id="tb_barcode_list" class="table table-bordered table-hover">
										<thead>
											<tr>
												<th>#</th>
												<th>Project Name</th>
												<th>Launch Step</th>
												<th>Barcode Path</th>
												<th>Config Path</th>
												<th>Create Time</th>
												<!-- <th>Action</th> -->
											</tr>
										</thead>
										<tfoot>
											<tr>
												<th>#</th>
												<th>Project Name</th>
												<th>Launch Step</th>
												<th>Barcode Path</th>
												<th>Config Path</th>
												<th>Create Time</th>
												<!-- <th>Action</th> -->
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
		<!-- /.content -->
	</div>



	<!-- /.content-wrapper -->

	<!-- Main Footer -->
	<?php $path = getcwd()."/layout/"; include($path."footer.php"); ?>
</div>
<!-- ./wrapper -->

<!-- REQUIRED SCRIPTS -->
<?php $path = getcwd()."/layout/"; include($path."footer_link.php"); ?>

<script src="assets/js/barcodes.js"></script>

</body>
</html>
