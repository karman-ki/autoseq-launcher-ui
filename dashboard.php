<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Autoseq-Launcher | Home</title>
	<?php $path = getcwd()."/layout/"; include($path."header_link.php"); ?>
</head>
<body class="hold-transition layout-top-nav">
<div class="wrapper">

	<?php $path = getcwd()."/layout/"; include($path."navigation.php"); ?>

	<!-- Content Wrapper. Contains page content -->
	<div class="content-wrapper">
		<div class="content-header">
			<div class="container-fluid">
				<div class="row mb-2">
					<div class="col-sm-6">
						<h5 class="m-0 text-uppercase"> Dashboard</h5>
					</div>
				</div>
			</div>
		</div>

		<!-- Main content -->
		<div class="content">
			<div class="container-fluid">
				<div class="row pb-4">
					<div class="col">
						<div class="card card-info card-outline">
							<div class="card-body">
								<!-- <div class="row">
									<div class="col-md-2 col-sm-6 col-12">
										<div class="info-box bg-gradient-info">
											<span class="info-box-icon"><i class="fas fa-plus-square"></i></span>
											<div class="info-box-content">
												<span class="info-box-text">New</span>
												<span class="info-box-number">41,410</span>
											</div>
										</div>
									</div>
									<div class="col-md-2 col-sm-6 col-12">
										<div class="info-box bg-gradient-primary">
											<span class="info-box-icon"><i class="fas fa-spinner"></i></span>
											<div class="info-box-content">
												<span class="info-box-text">Inprogress</span>
												<span class="info-box-number">41,410</span>
											</div>
										</div>
									</div>
									<div class="col-md-2 col-sm-6 col-12">
										<div class="info-box bg-gradient-success">
											<span class="info-box-icon"><i class="fas fa-check-circle"></i></span>
											<div class="info-box-content">
												<span class="info-box-text">Completed</span>
												<span class="info-box-number">41,410</span>
											</div>
										</div>
									</div>
									<div class="col-md-2 col-sm-6 col-12">
										<div class="info-box bg-gradient-danger">
											<span class="info-box-icon"><i class="fas fa-times"></i></span>
											<div class="info-box-content">
												<span class="info-box-text">Failed</span>
												<span class="info-box-number">41,410</span>
											</div>
										</div>
									</div>
									<div class="col-md-2 col-sm-6 col-12">
										<div class="info-box bg-gradient-secondary">
											<span class="info-box-icon"><i class="fas fa-signal"></i></span>
											<div class="info-box-content">
												<span class="info-box-text">Total</span>
												<span class="info-box-number">41,410</span>
											</div>
										</div>
									</div>
								</div> -->
								<div class="row">
									<div class="col-md-2 col-sm-6 col-12">
										<div class="info-box">
											<span class="info-box-icon bg-info"><i class="fas fa-plus"></i></span>
											<div class="info-box-content">
												<span class="info-box-text">New</span>
												<span class="info-box-number">0</span>
											</div>
										</div>
									</div>
									<div class="col-md-2 col-sm-6 col-12">
										<div class="info-box">
											<span class="info-box-icon bg-primary"><i class="fas fa-spinner"></i></span>
											<div class="info-box-content">
												<span class="info-box-text">In-progress</span>
												<span class="info-box-number">0</span>
											</div>
										</div>
									</div>
									<div class="col-md-2 col-sm-6 col-12">
										<div class="info-box">
											<span class="info-box-icon bg-success"><i class="fas fa-check"></i></span>
											<div class="info-box-content">
												<span class="info-box-text">Completed</span>
												<span class="info-box-number">0</span>
											</div>
										</div>
									</div>
									<div class="col-md-2 col-sm-6 col-12">
										<div class="info-box">
											<span class="info-box-icon bg-danger"><i class="fas fa-times"></i></span>
											<div class="info-box-content">
												<span class="info-box-text">Failed</span>
												<span class="info-box-number">0</span>
											</div>
										</div>
									</div>
									<div class="col-md-2 col-sm-6 col-12">
										<div class="info-box">
											<span class="info-box-icon bg-warning"><i class="fas fa-signal"></i></span>
											<div class="info-box-content">
												<span class="info-box-text">Total</span>
												<span class="info-box-number">0</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- /.content-wrapper -->

	<div class="modal" tabindex="-1" role="dialog" id="rSyncSection">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Sync the files for the patients : Anchorage</h5>
				</div>
				<div class="modal-body">
					<form action="" id="rSyncForm">
						<div class="form-group row">
							<label for="mdlProjectName" class="col-sm-4 col-form-label mandatory">Project List</label>
							<div class="col-sm-8">
								<select class="form-control" id="mdlProjectName">
									<option value="">-- Select --</option>
									<option value="PROBIO">PROBIO</option>
									<option value='PSFF'>PSFF</option>
								</select>
							</div>
						</div>
						<div class="form-group row">
							<label for="mdlCutomId" class="col-sm-4 col-form-label mandatory">Custom ID</label>
							<div class="col-sm-8">
								<input type="number" min="1" class="form-control" id="mdlCutomId" value="eg.. 829511">
							</div>
						</div>
						<div class="form-group row">
							<label for="mdlUsername" class="col-sm-4 col-form-label mandatory">Username</label>
							<div class="col-sm-8">
								<input type="text" class="form-control" id="mdlUsername" placeholder="Enter anchorage username">
							</div>
						</div>
						<div class="form-group row">
							<label for="mdlPassword" class="col-sm-4 col-form-label mandatory">Password</label>
							<div class="col-sm-8 input-group">
								<input type="password" class="form-control" id="mdlPassword" placeholder="Enter anchorage password">
								<div class="input-group-append">
									<span class="input-group-text"><i class="fa fa-eye-slash" id="modelTooglePwd"></i></span>
								</div>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-info upload-data-btn">Upload</button>
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Footer -->
	<?php $path = getcwd()."/layout/"; include($path."footer.php"); ?>
</div>
<!-- ./wrapper -->
<!-- REQUIRED SCRIPTS -->
<?php $path = getcwd()."/layout/"; include($path."footer_link.php"); ?>
<script type="text/javascript" src="assets/js/xlsx/xlsx.full.min.js"></script>
<script type="text/javascript" src="assets/js/xlsx/jszip.js"></script>
<script type="text/javascript" src="assets/js/xlsx/jquery.tabletojson.min.js"></script>
<script src="assets/js/dashboard.js"></script>
</body>
</html>
