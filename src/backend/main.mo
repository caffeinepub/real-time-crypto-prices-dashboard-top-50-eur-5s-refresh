actor {
  public query ({ caller }) func healthCheck() : async Text {
    "Backend is running";
  };

  public query ({ caller }) func version() : async Text {
    "1.0.0";
  };
};
