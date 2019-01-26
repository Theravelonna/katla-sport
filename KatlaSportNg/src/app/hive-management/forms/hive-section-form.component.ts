import { Component, OnInit } from '@angular/core';
import { HiveSection } from '../models/hive-section';
import { ActivatedRoute, Router } from '@angular/router';
import { HiveSectionService } from '../services/hive-section.service';

@Component({
  selector: 'app-hive-section-form',
  templateUrl: './hive-section-form.component.html',
  styleUrls: ['./hive-section-form.component.css']
})
export class HiveSectionFormComponent implements OnInit {
  
  hiveSection = new HiveSection(0, "", "", 0, false, "");
  existed = false;
  hiveId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hiveSectionService: HiveSectionService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.hiveId = p['hiveId'];
      if (p['id'] === undefined) return;
      this.hiveSectionService.getHiveSection(p['id']).subscribe(c => this.hiveSection = c);
      this.existed = true;
    });
  }

  navigateToHiveSections() {
    this.router.navigate([`/hive/${this.hiveId}/sections`]);
  }

  onCancel() {
    this.navigateToHiveSections();
  }
  
  onSubmit() {
    this.hiveSection.storeHiveId = this.hiveId;
    if (this.existed) {
      this.hiveSectionService.updateHiveSection(this.hiveSection).subscribe(p => this.navigateToHiveSections());
    } else {
      this.hiveSectionService.addHiveSection(this.hiveSection).subscribe(p => this.navigateToHiveSections());
    }
  }

  onDelete() {
    this.hiveSectionService.setHiveSectionStatus(this.hiveSection.id, true).subscribe(h => this.hiveSection.isDeleted = true);
  }

  onUndelete() {
    this.hiveSectionService.setHiveSectionStatus(this.hiveSection.id, false).subscribe(h => this.hiveSection.isDeleted = false);
  }

  onPurge() {
    this.hiveSectionService.deleteHiveSection(this.hiveSection.id).subscribe(h => this.navigateToHiveSections());
  }
}
