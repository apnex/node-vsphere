sub getStatus {
        my ($taskRef,$message) = @_;

        my $task_view = Vim::get_view(mo_ref => $taskRef);
        my $taskinfo = $task_view->info->state->val;
        my $continue = 1;
        while ($continue) {
                my $info = $task_view->info;
                if ($info->state->val eq 'success') {
                        print $message,"\n";
                        return $info->result;
                        $continue = 0;
                } elsif ($info->state->val eq 'error') {
                        my $soap_fault = SoapFault->new;
                        $soap_fault->name($info->error->fault);
                        $soap_fault->detail($info->error->fault);
                        $soap_fault->fault_string($info->error->localizedMessage);
                        die "$soap_fault\n";
                }
                sleep 5;
                $task_view->ViewBase::update_view_data();
        }
}

sub get_view {
   my $self = &_select_vim;
   my %args = @_;
   my $service = $self->{vim_service};
   
   if (! exists($args{mo_ref})) {
      Carp::confess("mo_ref argument is required");
   }
   my $mo_ref = $args{mo_ref};
   my $view_type = $mo_ref->type;
   if (exists ($args{view_type})) {
      $view_type = $args{view_type};
   }
   my $properties = "";
   if (exists($args{properties}) && 
       defined($args{properties}) && 
       $args{properties} ne "") {
      $properties = $args{properties};
   }
   my $view = $view_type->new($mo_ref, $self);
   $view->update_view_data($properties);
   return $view;
}

