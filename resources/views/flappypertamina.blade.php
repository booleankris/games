<!DOCTYPE html>
<html>
    
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <title>Flappy Pertamina</title>
    <script src="{{ asset('flappy/js/phaser.min.js') }}"></script>
    <style>
        body {
            padding: 0px;
            margin: 0px;
            background: black;
        }
        @font-face {
            font-family: 'feast';
            src: url('{{ asset('flappy/assets/fonts/feasfbrg-webfont.woff2') }}') format('woff2'),
                 url('{{ asset('flappy/assets/fonts/feasfbrg-webfont.woff') }}') format('woff');
            font-weight: normal;
            font-style: normal;
        }
        .fontLoader {
           position: absolute;
           left: -1000px;
           visibility: hidden;
        }
        .img{
            width: 145px;
            height: 75px;
            background: white;
            top: 20px;
            object-fit: contain;
            position: absolute;
        }
        @media screen and (max-width: 776px) {
            .img{
                width: 97px;
                height: 52px;
                background: white;
                top: 20px;
                object-fit: contain;
                position: absolute;
            }
        }
    </style>
</head>
    
<body>
    <!-- include game loader -->
    <img src="{{ asset('assets/interbio.svg') }}" class="img" width="100%" height="100%"> 
    <div class="fontLoader" style="font-family: feast">.</div>
	<script src="{{ asset('flappy/js/loader.js') }}"></script>
</body>
</html> 