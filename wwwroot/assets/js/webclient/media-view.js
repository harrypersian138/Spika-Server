
    var mediaViewManager = {
        
        messageId : 0,
        templatePicture : _.template('<a data-toggle="modal" data-target=".bs-example-modal-lg<%= _id  %>"><img class="img-rounded" src="' + _consts.RootURL + '/api/filedownloader?file=<%= picture_file_id %>" width="480" /></a></div></div><div class="modal fade bs-example-modal-lg<%= _id %>" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg"><div class="modal-content"><img src="' + _consts.RootURL + '/api/filedownloader?file=<%= picture_file_id %>" /></div>'), 
        templateUserInfo : _.template(''),

        templatePostHolder : _.template('<div class="post userId<%= user_id %>" id="message<%= message_id %>" messageid="<%= message_id %>"><div class="timestamp"><%= deleteicon %> <%= unreadicon %> <%= time %></div><%= content %></div>'),
        templateCommentRow : _.template('<div class="post comment"><div class="timestamp"><%= created_str %></div><div class="person_info"><h5><img class="img-thumbnail" src="' + _consts.RootURL + '/api/filedownloader?file=<%= avatar_thumb_file_id %>" width="48" /><a target="_blank" href="' + _consts.RootURL + '/admin/user/view/<%= avatar_thumb_file_id %>"></a> <%= comment %></h5><div class="clear"></div></div><div class="post_content" messageid="<%= _id %>"></div></div>'),
        
        init: function(){
            
            var self = this;
            
            $('#btn-chat-send-comment').click(function(){
                
                var comment = $('#textarea-comment').val();
                
                _spikaClient.postComment(self.messageId,comment,function(data){

                    $('#btn-chat-send-comment').html('Sent');
                    
                    self.loadComments(self.messageId);
    
                    _.delay(function(){
                        $('#btn-chat-send-comment').html('Send');
                        $('#btn-chat-send-comment').removeAttr('disabled');
                    }, 1000);
                
                },function(errorString){
                    
                });

                $('#textarea-comment').val('');
                $('#btn-chat-send-comment').html('<i class="fa fa-refresh fa-spin"></i> Sending');
                $('#btn-chat-send-comment').attr('disabled','disabled');
                
            });

            
        },
        loadMedia : function(messageId,fileId){

            var self = this;
            this.messageId = messageId;
            
            $('#comments-content-holder').html("");
            $('#media-content-holder').html("");
            
            _spikaClient.getMessage(messageId,function(data){
                
                var messageType = data.message_type;
                
                if(messageType == 'image'){
                    
                    var fileId = data.picture_file_id;
                    
                    var html = '';
                    html = self.templatePicture(data);

                    $('#media-content-holder').html(html);

                    self.loadComments(self.messageId);
                    
                }
                
            },function(errorString){
            
                
            });

            
        },
        
        loadComments : function(messageId){
            
            var self = this;

            _spikaClient.getMediaComments(messageId,function(data){

                var html = "";
                
                if(_.isUndefined(data.rows)){
                    return;
                }
                
                if(!_.isArray(data.rows)){
                    return;
                }
                
                _.each(data.rows, function(row){
                    
                    var value = row.value;
                    
                    if(_.isUndefined(value)){
                        return;
                    }
                    
                    var createdStr = generateCommentTimeStr(value.created);
                    value.created_str = createdStr;
                    
                    var rowHtml = self.templateCommentRow(value);
                    
                    html += rowHtml;
                    
                });
                
                $('#comments-content-holder').html(html);
                
            },function(errorString){
            
                
            });
            
        }
        
        
    };