// Documents -- {title: String,
//               content: String}
Documents = new Meteor.Collection("documents");

if (Meteor.isClient) {
  Deps.autorun(function () {
    Meteor.subscribe("alldocuments");
  });

  Template.root.currentDocumentId = function () {
    return Session.get("currentDocumentId") != "";
  };

  Template.document.events({
    'click button' : function () {
    },
    'keypress #doc-title' : function () {
    },
    'keypress #doc-content' : function () {
    },
    'click a.close' : function () {
      Session.set("currentDocumentId", "");
    }
  });

  Template.documentRow.events({
    'click tr' : function (event) {
      Session.set("currentDocumentId", event.currentTarget.className);
    }
  });

  Template.list.documents = function () {
    return Documents.find({});
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (Documents.find().count() == 0) {
      Documents.insert({
        documentID: Math.random().toString().split(".")[1],
        title: "My Document",
        content: "This is my document"
      });
      Documents.insert({
        documentID: Math.random().toString().split(".")[1],
        title: "Another Document",
        content: "This is another document"
      });
    }
  });

  // Publish all documents
  Meteor.publish('alldocuments', function () {
    return Documents.find({});
  });
}
