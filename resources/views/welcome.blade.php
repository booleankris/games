<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="description" content="3d, photo, gallery, advanced, javascript">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no, user-scalable=no">
    <link rel="stylesheet" href="{{ asset('puzzle_asset/css/app.css') }}">
    <link rel="stylesheet" href="{{ asset('puzzle_asset/css/bp3d.css') }}">
    <link rel="stylesheet" href="{{ asset('puzzle_asset/css/site.css') }}">
    <link rel="stylesheet" href="{{ asset('puzzle_asset/css/site-fullwidth.css') }}">
    <title>3D Block Puzzle</title>
    <script src="{{ asset('puzzle_asset/js/three.min.js') }}"></script>
    <script src="{{ asset('puzzle_asset/js/obc.js') }}"></script>
    <script src="{{ asset('puzzle_asset/js/anime.min.js') }}"></script>
    <script src="{{ asset('puzzle_asset/js/require.js') }}" data-main="js/entry.js"></script>
  </head>
  <style type="text/css">
        .img{
            width: 145px;
            height: 75px;
            background: white;
            top: 20px;
            object-fit: contain;
            position: absolute;
            z-index: 999999;
        }
        @media screen and (max-width: 776px) {
            .img{
                width: 97px;
                height: 52px;
                background: white;
                top: 20px;
                object-fit: contain;
                position: absolute;
                z-index: 999999;
            }
        }
  </style>

  <body>
    <img src="{{ asset('assets/interbio.svg') }}" class="img" width="100%" height="100%"> 
    <!-- Main -->
    <div id="wrapper">
      <!-- Start gallery-->
      <div class="rs-container">
        <div class="rs-bp3d">

        </div>
      </div>
      <!-- end gallery-->
    </div>
    <!-- end main wrapper-->
  </body>
</html>