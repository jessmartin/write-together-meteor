Documents = new Meteor.Collection("documents");

if (Meteor.isClient) {
  Deps.autorun(function () {
    Meteor.subscribe("documents");
  });

  Template.root.currentDocumentId = function () {
    return Session.get("currentDocumentId") != "" && Session.get("currentDocumentId") !== undefined;
  };

  currentDocumentId = function () {
    return Session.get("currentDocumentId");
  }

  saveTempDocument = function () {
    var properties = {
      tempTitle: $('#doc-title').val(),
      tempContent: $('#doc-content').val(),
      saved: false
    };

    Documents.update(currentDocumentId(), {$set: properties}, function(error, document) {
      if (error) { console.log(error.reason); }
    });
  }

  // Document Teplate

  Template.document.events({
    'click #doc-save' : function () {
      var properties = {
        title: $('#doc-title').val(),
        content: $('#doc-content').val(),
        saved: true
      };

      Documents.update(currentDocumentId(), {$set: properties}, function(error, document) {
        if (error) { console.log(error.reason); }
      });
    },
    'keyup #doc-title, keyup #doc-content' : saveTempDocument,
    'click a.close' : function () {
      Session.set("currentDocumentId", "");
    }
  });

  Template.document.helpers({ 
    currentDocument: function () {
      var doc = Documents.findOne( {_id: currentDocumentId()} );

      if (doc) {
        return doc;
      }
    },

  });

  // List Template

  Template.list.documents = function () {
    return Documents.find({});
  };

  Template.list.events( {
    'click a.btn': function (event) {
      var documentId = Documents.insert(
        {
          title: "",
          content: "",
          tempTitle: "",
          tempContent: "",
          lastSavedAt: "",
          saved: false
        }
      );

      Session.set("currentDocumentId", documentId);
    }
  });

  // Document Row Template

  Template.documentRow.events({
    'click tr' : function (event) {
      Session.set("currentDocumentId", event.currentTarget.className);
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish('documents', function () {
    return Documents.find({});
  });
}
