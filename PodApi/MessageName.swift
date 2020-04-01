//
//  MessageName.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 24.03.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

enum MessageName: String, CaseIterable {
    case Log = "log"
    case GetValue = "getValue"
    case SetValue = "setValue"
    case HttpRequest = "httpRequest"
    case AddQuads = "addQuads"
    case SelectQuads = "selectQuads"
}
