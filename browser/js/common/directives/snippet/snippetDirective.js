app.directive('snippet', function($rootScope, $state, Snippet, $mdExpansionPanel, Users) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/snippet/snippet.html',
        scope: {
            id: '=',
            type: '=',
            card: '@',
            users: '=',
            currentWeekNum: '='
        },
        link: function(scope, element, attributes) {

            scope.card = false;

            scope.snippet = {collaborators: {}};

            scope.toggleSubmit = function(){

                if (!scope.snippet.submitted) {
                    Snippet.submit(scope.id, $rootScope.user.manager).then(function(){
                        Materialize.toast('Snippet submitted', 1250, 'toastSubmitted');
                    }).catch(function(){
                        Materialize.toast('Error submitting', 2000, 'toastFail');
                    });
                }
                else {
                    Snippet.unsubmit(scope.id, $rootScope.user.manager).then(function(){
                        Materialize.toast('Snippet recalled', 1250, 'toastDeleted');
                    }).catch(function(){
                        Materialize.toast('Error recalling snippet', 2000, 'toastFail');
                    });
                }
            }

            scope.removeCollaborator = function(userId) {
                Users.removeAsCollaborator(userId, scope.id);
            }

            Snippet.getSnippetById(scope.id).$bindTo(scope, 'snippet');

            //ng-repeat through object directly instead!!
            scope.$watch('snippet.collaborators', function() {
                if (!scope.snippet.collaborators) return;
                var collabsToAdd = [];
                for (var key in scope.snippet.collaborators) {
                    Users.getById(key).then(function(user){
                        collabsToAdd.push(user);
                    })
                }
                scope.collaborators = collabsToAdd;
            }, true);

            scope.collapse = function() {
                $mdExpansionPanel(scope.id + scope.type).collapse();
            };

            scope.delete = function(snippetId){
                Snippet.delete(snippetId).then(function(){
                    Materialize.toast('Snippet deleted', 1250, 'toastDeleted');
                }).catch(function(){
                    Materialize.toast('Error deleting', 2000, 'toastFail');
                })
            }


            element.on('dblclick', function(){
                //only for report snippets
                if (!element.hasClass('fromReport')) return;

                if (element.hasClass('selectedForExport')) element.removeClass('selectedForExport')
                else element.addClass('selectedForExport');

                if (!$rootScope.selectedSnippetIds) $rootScope.selectedSnippetIds = [];

                var idx = $rootScope.selectedSnippetIds.indexOf(scope.id);
                if (idx === -1) {
                    $rootScope.selectedSnippetIds.push(scope.id);
                } else {
                    $rootScope.selectedSnippetIds.splice(idx, 1);
                }

                $rootScope.$apply();

            })

        }
    };
});
