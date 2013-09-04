// Documents -- {title: String,
//               content: String}
Documents = new Meteor.Collection("documents");

if (Meteor.isClient) {
  Deps.autorun(function () {
    Meteor.subscribe("alldocuments");
  });

  Template.document.greeting = function () {
    return "Welcome to write-together.";
  };

  Template.document.events({
    'click button' : function () {
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
      // Save the document
    },
    'keypress #doc-title' : function () {
      if (typeof console !== 'undefined')
        console.log("You changed the title");
      // Write the new title for the document
    },
    'keypress #doc-content' : function () {
      if (typeof console !== 'undefined')
        console.log("You changed the content");
      // Write the new content for the document
    }
  });

  Template.list.helpers({
    documents: function () {
      return [
        {"title": "My document"},
        {"title": "Your document"},
        {"title": "Their document"}
      ];
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  // Publish all documents
  Meteor.publish('alldocuments', function () {
    return Documents.find({});
  });
}
