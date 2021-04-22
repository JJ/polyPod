//
//  File.swift
//  PolyPod
//
//  Created by Felix Dahlke on 22.04.21.
//  Copyright © 2021 polypoly. All rights reserved.
//

import SwiftUI

struct NavigationBar<Content: View>: View {
    var leading: Content? = nil
    var center: Content? = nil
    var trailing: Content? = nil

    var body: some View {
        ZStack {
            center.frame(maxWidth: .infinity, alignment: .center)

            HStack {
                leading
                Spacer()
                trailing
            }
        }
        .padding(.horizontal, 8)
        .frame(maxWidth: .infinity, maxHeight: 42)
    }
}
