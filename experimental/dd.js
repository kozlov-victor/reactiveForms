 factory('appDraggableUtil',function(){
    return {
        lastObject:null
    }
})
    .directive('appDraggable', function(appDraggableUtil) {
        return {
            require: 'ngModel',
            restrict: 'A',
            replace: true,
            scope: {
                ngModel : '='
            },
            link: function (scope, element, attrs) {
                element.attr('draggable','true');
                var model = scope.ngModel;
                var emit = attrs.appDraggable;
                element.bind('dragstart', function (e) {
                    e.dataTransfer.setData('text/plain', emit); //cannot be empty string
                    e.dataTransfer.effectAllowed='move';
                    appDraggableUtil.lastObject = model;
                });
            }
        };
    })
    .directive('appDroppable', function($parse,appDraggableUtil) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('dragover', function (e) {
                    e.preventDefault();
                });
                element.bind('drop', function (e) {
                    e.preventDefault();
                    var canAccept = attrs.appDroppable;
                    var accepted = e.dataTransfer.getData('text/plain');
                    if (canAccept!=accepted) return;
                    var model = appDraggableUtil.lastObject;
                    var fn = $parse(attrs.appOnDropped);
                    if (!fn) return;
                    scope.$apply(function () {
                        fn(scope, {$object:model});
                    });
                });
            }
        };
    })