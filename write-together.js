// Documents -- {title: String,
//               content: String}
Documents = new Meteor.Collection("documents");

Meteor.methods({
  saveDocument: function(id, properties) {
    Documents.update(id, {$set: properties}, function(error, document) {
      if (error) {
        console.log(error.reason);
      }
    });
  }
});

if (Meteor.isClient) {
  Deps.autorun(function () {
    Meteor.subscribe("documents");
  });

  Template.root.currentDocumentId = function () {
    return Session.get("currentDocumentId") != "" && Session.get("currentDocumentId") != undefined;
  };

  Template.document.events({
    'click #doc-save' : function () {
    },
    'keyup #doc-title' : function () {
      var currentDocumentId = Session.get("currentDocumentId");

      var properties = {
        title: $('#doc-title').val(),
        content: $('#doc-content').val(),
      };

      Meteor.call('saveDocument', currentDocumentId, properties, function(error, post) {
        if (error) {
          console.log(error);
        }
      });
    },
    'keyup #doc-content' : function () {
      var currentDocumentId = Session.get("currentDocumentId");

      var properties = {
        title: $('#doc-title').val(),
        content: $('#doc-content').val(),
      };

      Meteor.call('saveDocument', currentDocumentId, properties, function(error, post) {
        if (error) {
          console.log(error);
        }
      });
    },
    'click a.close' : function () {
      Session.set("currentDocumentId", "");
    }
  });

  Template.document.helpers({ 
    currentDocument: function () {
      var currentDocumentId = Session.get("currentDocumentId");
      var doc = Documents.findOne( {_id: currentDocumentId} );
      console.log(currentDocumentId);
      if (doc) {
        return doc;
      }
    }
  });

  Template.list.documents = function () {
    return Documents.find({});
  };

  Template.documentRow.events({
    'click tr' : function (event) {
      Session.set("currentDocumentId", event.currentTarget.className);
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (Documents.find().count() == 0) {
      Documents.insert({
        title: "My Document",
        content: "This is my document"
      });
      Documents.insert({
        title: "Another Document",
        content: "This is another document"
      });
    }
  });

  // Publish all documents
  Meteor.publish('documents', function () {
    return Documents.find({});
  });
}
