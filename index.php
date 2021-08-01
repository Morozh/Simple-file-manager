<?php
    include 'manager-back.php';
?>
<!DOCTYPE html>
<html lang="ru">
<head>

    <meta charset="utf-8">
    <!-- CSS -->
    <link rel="stylesheet" href="assets/css/main.css">
    <!-- Required meta tags -->
    <meta name="description" content="File Manager">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <title>Custom File Manager</title>

<body>
    <main class="main">
        <div class="main-container">
            <div class="main-top__new-folder">
                <div class="main__logo">
                    <img src="../assets/icons/man.png" alt="Менеджер" width="18" height="18" /> Пользовательский файловый менеджер
                </div>
            </div>
            <div class="main__file-manager">
                <div class="main__file-manager-left">
                    <div id="top">
                        <div id="breadcrumb" class="main__file-directory">&nbsp;</div>
                    </div>
                    <div class="main__file-container">
                        <div class="get-back">Назад</div>
                        <table id="table" class="main__file-list">
                            <thead>
                                <tr>
                                    <th>Имя</th>
                                    <th class="sort-th">Размер</th>
                                    <th class="sort-th">Дата изменения</th>
                                </tr>
                            </thead>
                            <tbody id="list"></tbody>
                        </table>
                    </div>                  
                    <div class="main__file-manager-btn">
                        <a href="#" class="file-manager__btn">Скопировать</a>
                        <a href="#" class="file-manager__btn">Переместить</a>
                        <a id="del-file" href="javascript:void(0);" class="file-manager__btn">Удалить</a>
                        <a href="#" class="file-manager__btn popup-open">Создать</a>
                    </div>
                </div>
                <div class="main__file-manager-right">
                    <div id="top">
                        <div id="breadcrumb-two" class="main__file-directory">&nbsp;</div>
                    </div>
                    <div class="main__file-container">
                        <div class="get-back">Назад</div>
                        <table id="table-two" class="main__file-list">
                            <thead>
                                <tr>
                                    <th>Имя</th>
                                    <th class="sort-th">Размер</th>
                                    <th class="sort-th">Дата изменения</th>
                                </tr>
                            </thead>
                            <tbody id="list-two"></tbody>
                        </table>
                    </div>
                    <div class="main__file-manager-btn">
                        <a href="#" class="file-manager__btn">Скопировать</a>
                        <a href="#" class="file-manager__btn">Переместить</a>
                        <a id="del-file-two" href="javascript:void(0);" class="file-manager__btn">Удалить</a>
                        <a href="#" class="file-manager__btn popup-open">Создать</a>
                    </div>
                </div>
            </div>
            <div class="popup-fade">
                <div class="popup">
                    <?php if($allow_create_folder): ?>
                        <form action="?" method="post" id="mkdir" />
                            <label class="popup-title" for="dirname">Создать новую папку</label>
                            <input id="dirname" type="text" name="name" placeholder="Введите название папки" />
                            <input type="submit" value="Создать" />
                        </form>
                    <?php endif; ?>
                </div>		
            </div>
        </div>
    </main>

    <!-- jQuery, JavaScript -->
    <script src="assets/libs/jquery-3.5.1.min.js"></script>
    <script src="assets/js/script.js"></script>

  </body>
</html>