<!DOCTYPE html>
<!--
This is a starter template page. Use this page to start your new project from
scratch. This page gets rid of all links and provides the needed markup only.
-->
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CTM | Analysis</title>
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
            <h1 class="m-0"> Analysis List <small></small></h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <div class="content">
      <div class="container-fluid p-md-4">
        <div class="row">
          <div class="col">
            <div class="card card-primary card-outline">
              <div class="card-body">
                <div class="row">
									<div class="col-12"> 
                      <table id="tb_project_list" class="table table-bordered table-hover" >
                        <thead>
                          <tr>
                            <th>Project Name</th>
                            <th>Sample ID</th>
                            <th>Barcode Details</th>
                            <th>Cores / Machine Type</th>
                            <th>Create Time</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tfoot>
                          <tr>
                            <th>Project Name</th>
                            <th>Sample ID</th>
                            <th>Barcode Details</th>
                            <th>Cores / Machine Type</th>
                            <th>Create Time</th>
                            <th>Status</th>
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
    <!-- /.content -->
  </div>

  <div class="modal" tabindex="-1" role="dialog" id="editAnalysis">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Edit Analysis Information</h5>
      </div>
      <div class="modal-body">
        <form>
          <input type='hidden' id="project_id" value=''>
          <div class="form-group row">
            <label for="sample_id" class="col-sm-4 col-form-label">Sample ID</label>
            <div class="col-sm-8">
              <input type="text" readonly class="form-control-plaintext" id="sample_id" value="">
            </div>
          </div>
          <div class="form-group row">
            <label for="cores" class="col-sm-4 col-form-label">Cores</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" id="cores" placeholder="Cores">
            </div>
          </div>
          <div class="form-group row">
            <label for="machine_type" class="col-sm-4 col-form-label">Machine Type</label>
            <div class="col-sm-8">
            <select class="custom-select" id="machine_type">
              <option value=''>Choose...</option>
              <option value="anchorage">Anchorage</option>
              <option value="scalar">Scalar</option>
              <option value="vector">Vector</option>
            </select>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary update-analysis-info">Update</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
  <!-- /.content-wrapper -->

  <!-- Main Footer -->
  <?php $path = getcwd()."/layout/"; include($path."footer.php"); ?>
</div>
<!-- ./wrapper -->

<!-- REQUIRED SCRIPTS -->
<?php $path = getcwd()."/layout/"; include($path."footer_link.php"); ?>
<script src="assets/js/analysis.js"></script>

</body>
</html>
