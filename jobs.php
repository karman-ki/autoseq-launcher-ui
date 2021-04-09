<!DOCTYPE html>
<!--
This is a starter template page. Use this page to start your new project from
scratch. This page gets rid of all links and provides the needed markup only.
-->
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CTM | Jobs</title>
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
            <h1 class="m-0"> Jobs List <small></small></h1>
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
                <table id="tb_job_list" class="table table-bordered table-hover table-responsive">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Project_id</th>
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
    <!-- /.content -->
  </div>

  <div class="modal bd-example-modal-lg" tabindex="-1" role="dialog" id="viewLogModal">
  <div class="modal-dialog modal-lg" role="document">
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
  <!-- /.content-wrapper -->

  <!-- Main Footer -->
  <?php $path = getcwd()."/layout/"; include($path."footer.php"); ?>
</div>
<!-- ./wrapper -->

<!-- REQUIRED SCRIPTS -->
<?php $path = getcwd()."/layout/"; include($path."footer_link.php"); ?>

<script src="assets/js/jobs.js"></script>

</body>
</html>
