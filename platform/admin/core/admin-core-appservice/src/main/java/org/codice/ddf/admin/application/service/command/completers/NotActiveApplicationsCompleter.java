/**
 * Copyright (c) Codice Foundation
 * <p>
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 * <p>
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 */
package org.codice.ddf.admin.application.service.command.completers;

import org.apache.karaf.shell.api.action.lifecycle.Service;
import org.apache.karaf.shell.support.completers.StringsCompleter;
import org.codice.ddf.admin.application.service.Application;
import org.codice.ddf.admin.application.service.ApplicationStatus.ApplicationState;

/**
 * <p>
 * Completer that returns applications that are not active.
 * </p>
 */
@Service
public class NotActiveApplicationsCompleter extends AbstractApplicationsCompleter {

    @Override
    protected void addAppNames(Application currentApp, StringsCompleter delegate) {
        if (!applicationService.getApplicationStatus(currentApp)
                .getState()
                .equals(ApplicationState.ACTIVE)) {
            delegate.getStrings()
                    .add(currentApp.getName());
        }
    }
}
